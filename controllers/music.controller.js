const musicService = require("../services/music.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllMusics(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const fetchRes = await musicService.getAll();
    sendResponse(res, 200, fetchRes);
  } catch (err) {
    sendResponse(res, err.message === "no musics found" ? 200 : 500, err);
  }
}

async function getMusicById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    let fetchRes = await musicService.getOne(id);
    sendResponse(res, 200, fetchRes);
  } catch (err) {
    sendResponse(res, err.message === "no music found" ? 200 : 500, err);
  }
}

async function createMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const createData = req.body;
    createData.userId = 1;
    const createRes = await musicService.create(createData);
    sendResponse(res, 201, createRes);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}

async function updateMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const updateData = req.body;
    const id = parseInt(req.params.id);
    const updateRes = await musicService.update(updateData, id);
    sendResponse(res, 201, updateRes);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}

async function deleteMusic(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const deleteRes = await musicService.delete(id);
    sendResponse(res, 201, deleteRes);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}

module.exports = {
  getAllMusics,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
};
