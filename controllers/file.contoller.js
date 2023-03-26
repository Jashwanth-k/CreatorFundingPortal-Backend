const fileService = require("../services/file.service");
const path = require("path");

async function getCompressedFile(filename) {
  try {
    const file = fileService.getFileByFilename(filename, true);
    return file;
  } catch (err) {
    // console.log(err)
    throw new Error("no file found");
  }
}

async function getFile(req, res) {
  try {
    const filename = req.params?.filename;
    const ext = path.extname(filename);
    const file = await getCompressedFile(filename);
    res.send(file).status(200);
  } catch (err) {
    res.setHeader("content-type", "application/json");
    res
      .send(JSON.stringify({ message: err.message }))
      .status(err.status || 500);
  }
}

module.exports = getFile;
