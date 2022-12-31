const scriptService = require("../services/script.service");
const userService = require("../services/user.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllScripts(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const [status, fetchData] = await scriptService.getAll();
    sendResponse(res, status, fetchData);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function getScriptById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    let [status, fetchData] = await scriptService.getOne(id);
    sendResponse(res, status, fetchData);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function createScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const scriptData = req.body;
    scriptData.userId = req.token?.id;
    const [status, createRes] = await scriptService.create(scriptData);
    sendResponse(res, status, createRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function updateScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const scriptData = req.body;
    const id = parseInt(req.params.id);
    const [status, updateRes] = await scriptService.update(scriptData, id);
    sendResponse(res, status, updateRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function deleteScript(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const [status, deleteRes] = await scriptService.delete(id);
    sendResponse(res, status, deleteRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

module.exports = {
  getAllScripts,
  getScriptById,
  createScript,
  updateScript,
  deleteScript,
};
