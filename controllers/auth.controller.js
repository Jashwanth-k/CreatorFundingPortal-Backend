const authService = require("../services/auth.service");
const otpService = require("../services/otp.service");
const userService = require("../services/user.service");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function createUser(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const user = req.body;
    const createRes = await authService.signUp(user);
    const userId = createRes.id;
    const currOtp = otpService.generateOtp();
    await otpService.addOtpToDb(userId, currOtp);
    otpService.sendEmailOtp(user.email, currOtp);

    sendResponse(res, 201, {
      userId,
      message: "otp sent successfully, please verify",
    });
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

async function validateOtp(req, res) {
  try {
    const userId = req.body.userId;
    const otp = String(req.body.otp);
    const status = await otpService.verifyOtp(userId, otp);
    if (!status) {
      sendResponse(res, 401, { message: "incorrect otp" });
      return;
    }
    await userService.markVerified(userId);
    await otpService.deleteOtp(userId);
    sendResponse(res, 200, { message: "otp verified successfully" });
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  createUser,
  login,
  deleteUser,
  validateOtp,
};
