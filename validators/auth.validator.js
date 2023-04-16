const jwtService = require("../services/jwt.service");
const userService = require("../services/user.service");

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
        (!user.name ||
          !user.email ||
          !user.password ||
          !user.role ||
          !user.account)) ||
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

async function validateJwtForGetReq(req, res, next) {
  res.setHeader("content-type", "application/json");
  try {
    const userToken = req.headers.authorization;
    const flag = false;
    if (!userToken) {
      next();
      return;
    }
    if (!userToken.startsWith("Bearer")) {
      sendResponse(res, 498, {
        message: "token should start with Bearer",
      });
      return;
    }
    const token = await jwtService.validateToken(userToken.slice(7));
    const user = await userService.getUserByEmail(token.email);
    if (token.email !== user?.email || token.id !== user?.id) {
      sendResponse(res, 498, { message: "invalid token" });
      return;
    }

    req.token = token;
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

async function validateJwtToken(req, res, next) {
  res.setHeader("content-type", "application/json");
  try {
    const userToken = req.headers.authorization;
    if (!userToken) {
      sendResponse(res, 401, { message: "token absent" });
      return;
    }
    if (!userToken.startsWith("Bearer")) {
      sendResponse(res, 498, {
        message: "token should start with Bearer",
      });
      return;
    }
    const token = await jwtService.validateToken(userToken.slice(7));
    const user = await userService.getUserByEmail(token.email);
    if (token.email !== user?.email || token.id !== user?.id) {
      sendResponse(res, 498, { message: "invalid token" });
      return;
    }
    if (!user.verified) {
      sendResponse(res, 403, { message: "please verify your account" });
      return;
    }

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

function validateOtpBody(req, res, next) {
  res.setHeader("content-type", "application/json");
  try {
    const otp = req.body.otp;
    const userId = req.body.userId;
    if (!otp || !userId) {
      sendResponse(res, 400, { message: "invalid body format" });
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
  validateJwtForGetReq,
  validateOtpBody,
};
