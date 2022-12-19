const scriptService = require("../services/script.service");
const userService = require("../services/user.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllScripts(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const fetchData = await scriptService.getAll();
    sendResponse(res, 200, fetchData);
  } catch (err) {
    sendResponse(res, err.message === "no scripts found" ? 200 : 500, err);
  }
}

async function getScriptById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    let fetchData = await scriptService.getOne(id);
    sendResponse(res, 200, fetchData);
  } catch (err) {
    sendResponse(res, err.message === "no script found" ? 200 : 500, err);
  }
}

async function createScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const scriptData = req.body;
    scriptData.userId = 1;
    const createRes = await scriptService.create(scriptData);
    sendResponse(res, 201, createRes);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}

async function updateScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const scriptData = req.body;
    const id = parseInt(req.params.id);
    const updateRes = await scriptService.update(scriptData, id);
    sendResponse(res, 201, updateRes);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}

async function deleteScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const deleteRes = await scriptService.delete(id);
    sendResponse(res, 201, deleteRes);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}

module.exports = {
  getAllScripts,
  getScriptById,
  createScript,
  updateScript,
  deleteScript,
};
