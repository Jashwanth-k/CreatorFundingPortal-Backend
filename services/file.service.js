const multer = require("multer");
const { uploadDir, app } = require("../app");
const path = require("path");
const fs = require("fs");

class FileService {
  constructor() {
    // getting the files
    app.get("/uploads/:filename", (req, res) => {
      try {
        const filename = req.params.filename;
        const file = fs.readFileSync(process.env.UPLOAD_DIR + filename);
        res.send(file).status(200);
      } catch (err) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({ message: "no file found" })).status(404);
      }
    });
  }

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
        const checkList = [".png", ".jpeg", ".jpg", ".mp3", ".txt", ".docx"];
        if (!checkList.includes(ext)) {
          const err = new Error(
            "accepted file formats: .png,.jpeg,.jpg,.mp3,.txt,.docx"
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
    this.upload()(req, res, (err) => {
      if (err) {
        res.setHeader("content-type", "application/json");
        res.writeHead(err.status || 500);
        res.end(JSON.stringify({ message: err.message }));
        return;
      }
      req.files.forEach(
        (file) => (req.body[file.mimetype.split("/")[0]] = file.filename)
      );
      next();
    });
  }

  delete(filenames = []) {
    filenames.forEach((name) => {
      name && fs.unlink(uploadDir + name, (err) => {});
    });
  }
}

const fileService = new FileService();
module.exports = fileService;
