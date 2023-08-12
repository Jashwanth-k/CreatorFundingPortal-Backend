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
    const file = fileService.getFileByFilename(filename, !paidStatus);
    res.send(file).status(200);

    // sending files from s3
    // const file = await awsService.getFileByFileName(filename, false);
    // file.Body.pipe(res);
  } catch (err) {
    res.setHeader("content-type", "application/json");
    res
      .send(JSON.stringify({ message: err.message }))
      .status(err.status || 500);
  }
}

module.exports = getFile;
