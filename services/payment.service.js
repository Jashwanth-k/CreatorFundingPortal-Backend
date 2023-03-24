const db = require("../models/index");
const userService = require("../services/user.service");

class PaymentService {
  constructor() {}

  async create(userId, componentId, type) {
    try {
      const user = await userService.getUserById(userId);
      const tableRow = { userId: user.id };
      tableRow[`${type}Id`] = componentId;
      let data;
      if (type === "script") data = await user.createScriptPayment(tableRow);
      if (type === "music") data = await user.createMusicPayment(tableRow);
      if (type === "nft") data = await user.createNftPayment(tableRow);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async getAll(userId) {
    try {
      const user = await userService.getUserById(userId);
      const totalPayments = {};
      totalPayments["script"] = await user.getScriptPayments();
      totalPayments["music"] = await user.getMusicPayments();
      totalPayments["nft"] = await user.getNftPayments();
      return totalPayments;
    } catch (err) {
      throw err;
    }
  }
}

const paymentService = new PaymentService();
module.exports = paymentService;
