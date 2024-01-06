const fileService = require("../services/file.service");
const paymentService = require("../services/payment.service");
const awsService = require("../services/aws.service");

async function checkPaidStatus(userId, filename) {
  try {
    if (!userId) return false;
    const paidComponents = await paymentService.findAll(userId, true);
    for (let type of Object.values(paidComponents)) {
      for (let el of type) {
        if (
          el.image === filename ||
          el.text === filename ||
          el.audio === filename
        )
          return true;
      }
    }
    return false;
  } catch (err) {
    throw err;
  }
}

async function getFile(req, res) {
  try {
    const filename = req.params?.filename;
    const paidStatus = await checkPaidStatus(req.token?.id, filename);
    const getFileFromS3 = JSON.parse(process.env.GET_FILES_FROM_S3 || "false");
    const file = await fileService.getFileByFilename(
      filename,
      !paidStatus,
      getFileFromS3
    );

    if (getFileFromS3) {
      // sending files from s3
      file.Body.pipe(res);
      return;
    }
    res.send(file).status(200);
  } catch (err) {
    res.setHeader("content-type", "application/json");
    res
      .send(JSON.stringify({ message: err.message }))
      .status(err.status || 500);
  }
}

async function getOriginalFile(req, res) {
  try {
    const filename = req.params?.filename;
    const getFileFromS3 = JSON.parse(process.env.GET_FILES_FROM_S3 || "false");
    const file = await fileService.getFileByFilename(
      filename,
      false,
      getFileFromS3
    );

    if (getFileFromS3) {
      file.Body.pipe(res);
      return;
    }
    res.send(file).status(200);
  } catch (err) {
    res.setHeader("content-type", "application/json");
    res
      .send(JSON.stringify({ message: err.message }))
      .status(err.status || 500);
  }
}

module.exports = { getFile, getOriginalFile };
