const paymentService = require("../services/payment.service");
const that = {};

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

that.sendPaymentRequest = async function (req, res) {
  try {
    const a = 100;
    const accounts = await req.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts[0]);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
};

module.exports = that;
