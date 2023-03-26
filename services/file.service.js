const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mp3cutter = require("mp3-cutter");

const uploadDir = process.env.UPLOAD_DIR;
const compressDir = process.env.COMPRESS_DIR;
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
          type === "audio" && (await this.trimMusicFile(file.filename));
          type === "text" && (await this.trimTextFile(file.filename));
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
      name && fs.unlink(uploadDir + name, (err) => {});
      name && fs.unlink(compressDir + name, (err) => {});
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

  async compressImage(filename) {
    try {
      const fileBuffer = this.getFileByFilename(filename);
      return await sharp(fileBuffer)
        .jpeg({ mozjpeg: true })
        .toFile(compressDir + filename);
    } catch (err) {
      throw err;
    }
  }

  async trimMusicFile(filename) {
    try {
      return await mp3cutter.cut({
        src: path.join(uploadDir + filename),
        target: path.join(compressDir + filename),
        start: 0,
        end: 10,
      });
    } catch (err) {
      throw err;
    }
  }

  async trimTextFile(filename) {
    try {
      const textFile = fs.readFileSync(uploadDir + filename, "utf8");
      const newText = textFile.split(/\n/).slice(0, 10).join("");
      fs.writeFileSync(compressDir + filename, newText);
    } catch (err) {
      throw err;
    }
  }
}

const fileService = new FileService();
module.exports = fileService;
