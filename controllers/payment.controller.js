const paymentService = require("../services/payment.service");
const musicService = require("../services/music.service");
const scriptService = require("../services/script.service");
const nftService = require("../services/nft.service");
const favoriteService = require("../services/favorite.service");
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
    const txHash = req.body?.tHex;
    if (!txHash) {
      sendResponse(res, 400, {
        message: "txHash is required to validate transaction status",
      });
      return;
    }

    const tStatus = await paymentService.getTransactionStatus(txHash);
    const service = getServiceByType(type);
    await service.getOne(componentId);
    const data = await paymentService.create(userId, componentId, type);
    sendResponse(res, 201, data);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message || err });
  }
};

that.getPayments = async function (req, res) {
  try {
    const userId = req.token?.id;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;
    let data = await paymentService.findAll(userId, true, req.query);

    const script = await scriptService.getAll({ userId }, true);
    const music = await musicService.getAll({ userId }, true);
    const nft = await nftService.getAll({ userId }, true);
    const uploads = { script, music, nft };
    [("music", "script", "nft")].forEach((type) => {
      data[type] = data[type].filter((paidEl) => {
        const isPresent = uploads[type].some(
          (uploadEl) => uploadEl.id === paidEl.id
        );
        return !isPresent;
      });
    });

    const favoriteData = await favoriteService.findAll(userId);
    ["music", "script", "nft"].forEach((type) => {
      data[type].map((el) => {
        if (favoriteData[type].has(el.id)) el.isLiked = true;
        return el;
      });
    });
    data = Object.keys(data).reduce((acc, type) => {
      return acc.concat(data[type]);
    }, []);
    data = data.slice(skip).slice(0, limit);
    if (!data.length) {
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
