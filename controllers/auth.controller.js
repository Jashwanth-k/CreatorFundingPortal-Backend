const authService = require("../services/auth.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function createUser(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const [status, createRes] = await authService.signUp(user);
    sendResponse(res, status, createRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function login(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const [status, loginRes] = await authService.signIn(user);
    sendResponse(res, status, loginRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function deleteUser(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const [status, deleteRes] = await authService.delete(user);
    sendResponse(res, status, deleteRes);
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

module.exports = {
  createUser,
  login,
  deleteUser,
};
