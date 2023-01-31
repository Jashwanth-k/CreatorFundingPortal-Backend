const authService = require("../services/auth.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function createUser(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const createRes = await authService.signUp(user);
    sendResponse(res, 201, createRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function login(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const loginRes = await authService.signIn(user);
    res.cookie("token", loginRes.token, { httpOnly: true });
    sendResponse(res, 200, loginRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function deleteUser(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const deleteRes = await authService.delete(user);
    sendResponse(res, 200, deleteRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  createUser,
  login,
  deleteUser,
};
