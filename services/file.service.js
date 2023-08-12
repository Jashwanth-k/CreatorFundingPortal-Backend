const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mp3cutter = require("mp3-cutter");
const awsService = require("./aws.service");
const uploadDir = process.env.UPLOAD_DIR;
const compressDir = process.env.COMPRESS_DIR;
const dirs = [compressDir, uploadDir];

class FileService {
  constructor() {}

  upload() {
    return multer({
      limits: { fileSize: process.env.MAX_FILE_SIZE },
      storage: multer.diskStorage({
        destination: function (req, file, callBack) {
          callBack(null, uploadDir);
        },
        filename: function (req, file, callBack) {
          callBack(
            null,
            `${path.parse(file.originalname).name}-${Date.now()}${path.extname(
              file.originalname
            )}`
          );
        },
      }),
      fileFilter: function (req, file, callBack) {
        const ext = path.extname(file.originalname);
        const checkList = [".jpeg", ".jpg", ".mp3", ".txt", ".docx"];
        if (!checkList.includes(ext)) {
          const err = new Error(
            "accepted file formats: .jpeg,.jpg,.mp3,.txt,.docx"
          );
          err.status = 415;
          callBack(err);
        } else {
          callBack(null, true);
        }
      },
    }).any();
  }

  fileUploader(req, res, next) {
    this.upload()(req, res, async (err) => {
      try {
        if (err) throw err;
        if (!req.files) {
          next();
          return;
        }

        for (let file of req.files) {
          const type = file.mimetype.split("/")[0];
          req.body[type] = file.filename;
          type === "image" && (await this.compressImage(file.filename));
          type === "audio" && this.trimMusicFile(file.filename);
          type === "text" && this.trimTextFile(file.filename);

          // uploading to s3
          dirs.forEach((dir) => {
            awsService.uploadToS3(path.join(dir + file.filename));
          });
        }
        next();
      } catch (err) {
        req.files?.forEach((file) => this.delete([file.filename]));
        res.setHeader("content-type", "application/json");
        res.writeHead(err.status || 500);
        res.end(JSON.stringify({ message: err.message }));
      }
    });
  }

  delete(filenames = []) {
    filenames.forEach((name) => {
      dirs.forEach((dir) => {
        if (!name) return;

        fs.unlink(dir + name, (err) => {});
        // delete files From s3
        awsService.deleteFileFromS3(path.join(dir + name));
      });
    });
  }

  getFileByFilename(filename, isCompressed) {
    try {
      const file = fs.readFileSync(
        isCompressed ? compressDir + filename : uploadDir + filename
      );
      return file;
    } catch (err) {
      throw err;
    }
  }

  async addWaterMark(filename) {
    try {
      const fileBuffer = fs.readFileSync(compressDir + filename);

      const { height, width } = await sharp(fileBuffer).metadata();
      const logoDimPer = process.env.LOGO_DIMEN_PERCENT;
      const logoHeight = Math.floor((height * logoDimPer) / 100);
      const logoWidth = Math.floor((width * logoDimPer) / 100);

      const watermarkBuffer = await sharp(process.env.WATERMARK_LOGO)
        .resize(Math.min(logoHeight, logoWidth))
        .toBuffer();
      return await sharp(fileBuffer)
        .composite([{ input: watermarkBuffer, gravity: "northwest" }])
        .toFile(compressDir + filename);
    } catch (err) {
      throw err;
    }
  }

  async compressImage(filename) {
    try {
      return await sharp(uploadDir + filename)
        .jpeg({ mozjpeg: true, quality: +process.env.COMPRESS_IMG_QUALITY })
        .toFile(compressDir + filename);
    } catch (err) {
      throw err;
    }
  }

  async trimMusicFile(filename) {
    try {
      return mp3cutter.cut({
        src: path.join(uploadDir + filename),
        target: path.join(compressDir + filename),
        start: 0,
        end: process.env.MUSIC_COMPRESS_LEN,
      });
    } catch (err) {
      throw err;
    }
  }

  async trimTextFile(filename) {
    try {
      const textFile = fs.readFileSync(uploadDir + filename, "utf8");
      const newText = textFile
        .split(/\n/)
        .slice(0, process.env.TEXT_TRIM_LEN)
        .join("");
      fs.writeFileSync(compressDir + filename, newText);
    } catch (err) {
      throw err;
    }
  }
}

const fileService = new FileService();
module.exports = fileService;
