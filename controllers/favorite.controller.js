const favoriteService = require("../services/favorite.service");
const musicService = require("../services/music.service");
const nftService = require("../services/nft.service");
const scriptService = require("../services/script.service");

function sendResponse(res, status, resObj) {
  res.setHeader("contet-type", "application/json");
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getFavorites(req, res) {
  try {
    const userId = req.token?.id;
    const getRes = await favoriteService.findAll(userId);
    sendResponse(res, 200, getRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function addFavorites(req, res) {
  try {
    const id = parseInt(req.params.id);
    const type = req.query.type;
    const userId = req.token?.id;

    let service;
    if (type === "script") service = scriptService;
    if (type === "music") service = musicService;
    if (type === "nft") service = nftService;
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
