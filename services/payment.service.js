const db = require("../models/index");
const userService = require("../services/user.service");

class PaymentService {
  constructor() {}

  async create(userId, componentId, type) {
    try {
      const user = await userService.getUserById(userId);
      const tableRow = { userId: user.id };
      tableRow[`${type}Id`] = Number(componentId);
      let data;
      if (type === "script") data = await user.createScriptPayment(tableRow);
      if (type === "music") data = await user.createMusicPayment(tableRow);
      if (type === "nft") data = await user.createNftPayment(tableRow);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async hasOne(userId, componentId, type) {
    try {
      let check;
      if (type === "script")
        check = await db.scriptPayment.findOne({
          where: { userId, scriptId: componentId },
        });
      if (type === "music")
        check = await db.musicPayment.findOne({
          where: { userId, musicId: componentId },
        });
      if (type === "nft")
        check = await db.nftPayment.findOne({
          where: { userId, nftId: componentId },
        });
      return check;
    } catch (err) {
      throw err;
    }
  }

  async findAll(userId, includeAssociation, query = {}) {
    try {
      const user = await userService.getUserById(userId);
      const totalPayments = {};
      totalPayments["script"] = await user.getScriptPayments({
        include: "script",
        limit: parseInt(query.limit) || Number.MAX_SAFE_INTEGER,
        offset: parseInt(query.skip) || 0,
      });
      totalPayments["music"] = await user.getMusicPayments({
        include: "music",
        limit: parseInt(query.limit) || Number.MAX_SAFE_INTEGER,
        offset: parseInt(query.skip) || 0,
      });
      totalPayments["nft"] = await user.getNftPayments({
        include: "nft",
        limit: parseInt(query.limit) || Number.MAX_SAFE_INTEGER,
        offset: parseInt(query.skip) || 0,
      });

      const a = totalPayments.script;
      totalPayments.script.forEach((el, idx) => {
        totalPayments.script[idx] = includeAssociation
          ? el.script
          : el.scriptId;
        el.script.isPaid = true;
      });
      totalPayments.music.forEach((el, idx) => {
        totalPayments.music[idx] = includeAssociation ? el.music : el.musicId;
        el.music.isPaid = true;
      });
      totalPayments.nft.forEach((el, idx) => {
        totalPayments.nft[idx] = includeAssociation ? el.nft : el.nftId;
        el.nft.isPaid = true;
      });
      if (!includeAssociation) {
        totalPayments.script = new Set(totalPayments.script);
        totalPayments.music = new Set(totalPayments.music);
        totalPayments.nft = new Set(totalPayments.nft);
      }
      return totalPayments;
    } catch (err) {
      throw err;
    }
  }
}

const paymentService = new PaymentService();
module.exports = paymentService;
