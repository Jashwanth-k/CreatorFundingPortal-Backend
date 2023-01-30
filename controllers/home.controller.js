const musicService = require("../services/music.service");
const scriptService = require("../services/script.service");

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
    if (script.length === 0 && music.length === 0)
      throw createError(404, "no data found");
    const newData = {};
    newData.script = script;
    newData.music = music;
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
    if (script.length === 0 && music.length === 0)
      throw createError(404, "no data found");
    const newData = {};
    newData.script = script;
    newData.music = music;
    sendResponse(res, 200, newData);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  getHome,
  getCreatorUploads,
};
