const fileService = require("../services/file.service");
const musicService = require("../services/music.service");
const favoriteService = require("../services/favorite.service");
const paymentService = require("../services/payment.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllMusics(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const fetchRes = await musicService.getAll(req.query);
    const userId = req.token?.id;
    if (userId) {
      const favoriteData = await favoriteService.findAll(userId);
      const paymentsData = await paymentService.findAll(userId);
      for (currMusic of fetchRes) {
        if (favoriteData.music.has(currMusic.id)) currMusic.isLiked = true;
        if (paymentsData.music.has(currMusic.id)) currMusic.isPaid = true;
      }
    }
    sendResponse(res, 200, fetchRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function getMusicById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const userId = req.token?.id;
    const id = parseInt(req.params.id);
    const fetchRes = await musicService.getOne(id);
    if (userId) {
      const isFavorite = await favoriteService.findOne(userId, id, "music");
      const isPurchased = await paymentService.hasOne(userId, id, "music");
      if (isFavorite) fetchRes.isLiked = true;
      if (isPurchased) fetchRes.isPaid = true;
    }
    sendResponse(res, 200, fetchRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function createMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const createData = req.body;
    createData.userId = req.token?.id;
    const createRes = await musicService.create(createData);
    paymentService.create(
      createRes.dataValues?.userId,
      createRes.dataValues?.id,
      "music"
    );
    sendResponse(res, 201, createRes);
  } catch (err) {
    fileService.delete([req.body.image, req.body.audio]);
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function updateMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const userId = req.token.id;
    const updateData = req.body;
    const music = await musicService.getOne(id, userId);
    if (req.body.image) {
      fileService.delete([music.image]);
    }
    if (req.body.audio) {
      fileService.delete([music.audio]);
    }

    const updateRes = await musicService.update(updateData, id);
    sendResponse(res, 200, updateRes);
  } catch (err) {
    fileService.delete([req.body.image, req.body.audio]);
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function deleteMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const deleteRes = await musicService.delete(id, req.token?.id);
    sendResponse(res, 200, deleteRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  getAllMusics,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
};
