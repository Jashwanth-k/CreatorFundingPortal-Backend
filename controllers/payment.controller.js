const paymentService = require("../services/payment.service");
const musicService = require("../services/music.service");
const scriptService = require("../services/script.service");
const nftService = require("../services/nft.service");
const that = {};

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

function getServiceByType(type) {
  return { musicService, scriptService, nftService }[`${type}Service`];
}

that.addPayment = async function (req, res) {
  try {
    const userId = req.token?.id;
    const type = req.query.type;
    const componentId = req.params?.id;
    const service = getServiceByType(type);
    await service.getOne(componentId);
    const data = await paymentService.create(userId, componentId, type);
    sendResponse(res, 201, data);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
};

that.getPayments = async function (req, res) {
  try {
    const userId = req.token?.id;
    const data = await paymentService.getAll(userId);
    if (!data.script.length && !data.music.length && !data.nft.length) {
      const err = new Error("no payments found");
      err.status = 404;
      throw err;
    }
    sendResponse(res, 200, data);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
};

module.exports = that;
