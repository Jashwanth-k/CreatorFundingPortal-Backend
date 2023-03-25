const favoriteService = require("../services/favorite.service");
const musicService = require("../services/music.service");
const nftService = require("../services/nft.service");
const scriptService = require("../services/script.service");
const paymentService = require("../services/payment.service");

function sendResponse(res, status, resObj) {
  res.setHeader("content-type", "application/json");
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

function getService(type) {
  let service;
  if (type === "script") service = scriptService;
  if (type === "music") service = musicService;
  if (type === "nft") service = nftService;
  return service;
}

async function getFavorites(req, res) {
  try {
    const userId = req.token?.id;
    const getRes = await favoriteService.findAll(userId);

    const favorites = {
      script: [],
      music: [],
      nft: [],
    };
    for (let type in getRes) {
      const service = getService(type);
      for (let id of getRes[type]) {
        const component = await service.getOne(id);
        const isPurchased = await paymentService.hasOne(userId, id, type);
        component.isLiked = true;
        if (isPurchased) component.isPaid = true;
        favorites[type].push(component);
      }
    }
    if (
      !favorites.script.length &&
      !favorites.music.length &&
      !favorites.nft.length
    ) {
      sendResponse(res, 404, { message: "no favorites found" });
      return;
    }
    sendResponse(res, 200, favorites);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function addFavorites(req, res) {
  try {
    const id = parseInt(req.params.id);
    const type = req.query.type;
    const userId = req.token?.id;

    const service = getService(type);
    await service.getOne(id);

    const addRes = await favoriteService.create(userId, id, type);
    sendResponse(res, 201, addRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function removeFavorites(req, res) {
  try {
    const id = parseInt(req.params.id);
    const type = req.query.type;
    const userId = req.token?.id;
    const deleteRes = await favoriteService.delete(userId, id, type);
    sendResponse(res, 200, deleteRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  getFavorites,
  addFavorites,
  removeFavorites,
};
