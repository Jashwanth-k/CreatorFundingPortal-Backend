const fileService = require("../services/file.service");
const musicService = require("../services/music.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllMusics(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const [status, fetchRes] = await musicService.getAll(req.query);
    sendResponse(res, status, fetchRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function getMusicById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const [status, fetchRes] = await musicService.getOne(id);
    sendResponse(res, status, fetchRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function createMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const createData = req.body;
    createData.userId = req.token?.id;
    const [status, createRes] = await musicService.create(createData);
    sendResponse(res, status, createRes);
  } catch (err) {
    fileService.delete([req.body.image, req.body.audio]);
    sendResponse(res, 500, { message: err.message });
  }
}

async function updateMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const userId = req.token.id;
    const updateData = req.body;
    const [isStatus401, music] = await musicService.getOne(id, userId);
    if (isStatus401 === 401) {
      throw Error(music);
    }
    if (req.body.image) {
      fileService.delete([music.image]);
    }
    if (req.body.audio) {
      fileService.delete([music.audio]);
    }

    const [status, updateRes] = await musicService.update(updateData, id);
    sendResponse(res, status, updateRes);
  } catch (err) {
    fileService.delete([req.body.image, req.body.audio]);
    sendResponse(res, 500, { message: err.message });
  }
}

async function deleteMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const [status, deleteRes] = await musicService.delete(id, req.token?.id);
    sendResponse(res, status, deleteRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

module.exports = {
  getAllMusics,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
};
