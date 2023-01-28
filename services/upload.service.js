const multer = require("multer");
class UploadService {
  upload;
  destFolder;
  constructor() {
    this.destFolder = __dirname + process.env.UPLOAD_DIR;
    this.upload = multer({
      limits: { fileSize: process.env.MAX_FILE_SIZE },
      storage: multer.diskStorage({
        destination: function (req, file, callBack) {
          callBack(null, this.destFolder);
        },
        filename: function (req, file, callBack) {
          callBack(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
          );
        },
      }),
      fileFilter: function (req, file, callBack) {
        const ext = path.extname(file.originalname);
        const checkList = [".png", ".jpeg", ".jpg", ".mp3", ".txt", ".docx"];
        if (!checkList.includes(ext)) {
          callBack(
            new Error("accepted file formats: .png,.jpeg,.jpg,.mp3,.txt,.docx")
          );
        } else {
          callBack(null, true);
        }
      },
    }).any();
  }
}

const uploadService = new UploadService();
module.exports = uploadService;
