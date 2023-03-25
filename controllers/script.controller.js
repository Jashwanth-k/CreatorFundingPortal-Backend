const scriptService = require("../services/script.service");
const fileService = require("../services/file.service");
const favoriteService = require("../services/favorite.service");
const paymentService = require("../services/payment.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllScripts(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const fetchData = await scriptService.getAll(req.query);
    const userId = req.token?.id;
    if (userId) {
      const favoriteData = await favoriteService.findAll(userId);
      const paymentsData = await paymentService.findAll(userId);
      for (currScript of fetchData) {
        if (favoriteData.script.has(currScript.id)) currScript.isLiked = true;
        if (paymentsData.script.has(currScript.id)) currScript.isPaid = true;
      }
    }
    sendResponse(res, 200, fetchData);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function getScriptById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const userId = req.token?.id;
    const id = parseInt(req.params.id);
    let fetchData = await scriptService.getOne(id);
    if (userId) {
      const isFavorite = await favoriteService.findOne(userId, id, "script");
      const isPurchased = await paymentService.hasOne(userId, id, "script");
      if (isFavorite) fetchData.isLiked = true;
      if (isPurchased) fetchData.isPaid = true;
    }
    sendResponse(res, 200, fetchData);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function createScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const scriptData = req.body;
    scriptData.userId = req.token?.id;
    const createRes = await scriptService.create(scriptData);
    sendResponse(res, 201, createRes);
  } catch (err) {
    fileService.delete([req.body.image, req.body.text]);
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function updateScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const userId = req.token?.id;
    const updateData = req.body;
    const script = await scriptService.getOne(id, userId);
    if (req.body.image) {
      fileService.delete([script.image]);
    }
    if (req.body.text) {
      fileService.delete([script.text]);
    }
    const updateRes = await scriptService.update(updateData, id);
    sendResponse(res, 200, updateRes);
  } catch (err) {
    fileService.delete([req.body.image, req.body.text]);
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function deleteScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const deleteRes = await scriptService.delete(id, req.token?.id);
    sendResponse(res, 200, deleteRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  getAllScripts,
  getScriptById,
  createScript,
  updateScript,
  deleteScript,
};
