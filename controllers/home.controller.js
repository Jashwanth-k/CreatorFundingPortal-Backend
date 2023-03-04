const musicService = require("../services/music.service");
const scriptService = require("../services/script.service");
const nftService = require("../services/nft.service");
const favoriteService = require("../services/favorite.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function getHome(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const script = await scriptService.getAll(req.query, true);
    const music = await musicService.getAll(req.query, true);
    const nft = await nftService.getAll(req.query, true);
    if (script.length === 0 && music.length === 0 && nft.length === 0)
      throw createError(404, "no data found");

    const userId = req.token?.id;
    let favoriteData = { script: new Set(), music: new Set(), nft: new Set() };
    if (userId) favoriteData = await favoriteService.findAll(userId);
    for (currScript of script) {
      if (favoriteData["script"].has(currScript.id)) currScript.isLiked = true;
    }
    for (currMusic of music) {
      if (favoriteData["music"].has(currMusic.id)) currMusic.isLiked = true;
    }
    for (currNft of nft) {
      if (favoriteData["nft"].has(currNft.id)) currNft.isLiked = true;
    }
    const newData = {};
    newData.script = script;
    newData.music = music;
    newData.nft = nft;
    sendResponse(res, 200, newData);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function getCreatorUploads(req, res) {
  try {
    const query = { userId: req.token?.id };
    const script = await scriptService.getAll(query, true);
    const music = await musicService.getAll(query, true);
    const nft = await nftService.getAll(query, true);
    if (script.length === 0 && music.length === 0 && nft.length === 0)
      throw createError(404, "no data found");

    const userId = req.token?.id;
    let favoriteData = await favoriteService.findAll(userId);
    for (currScript of script) {
      if (favoriteData["script"].has(currScript.id)) currScript.isLiked = true;
    }
    for (currMusic of music) {
      if (favoriteData["music"].has(currMusic.id)) currMusic.isLiked = true;
    }
    for (curNft of nft) {
      if (favoriteData["nft"].has(currNft.id)) currNft.isLiked = true;
    }
    const newData = {};
    newData.script = script;
    newData.music = music;
    newData.nft = nft;
    sendResponse(res, 200, newData);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  getHome,
  getCreatorUploads,
};
