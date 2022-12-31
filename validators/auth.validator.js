const jwtService = require("../services/jwt.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

function validateAuthBody(signIn, req, res, next) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    if (
      (!signIn &&
        (!user.name || !user.email || !user.password || !user.role)) ||
      (signIn && (!user.email || !user.password))
    ) {
      sendResponse(res, 400, { message: "incorrect body format" });
      return;
    }
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function validateJwtToken(req, res, next) {
  res.setHeader("content-type", "application/json");
  try {
    const userToken = req.headers.authorization;
    if (!userToken.startsWith("Bearer")) {
      sendResponse(res, 498, { message: "invalid token" });
      return;
    }
    const token = await jwtService.validateToken(userToken.slice(7));
    req.token = token;
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

function validateEmail(req, res, next) {
  res.setHeader("content-type", "applications/json");
  try {
    const email = req.body.email;
    if (!email.includes("@") || !email.endsWith(".com")) {
      sendResponse(res, 400, { message: "invalid email format" });
      return;
    }
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

module.exports = {
  validateAuthBody,
  validateJwtToken,
  validateEmail,
};
