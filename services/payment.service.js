const db = require("../models/index");
const userService = require("../services/user.service");
const fetch = require("node-fetch");

class PaymentService {
  constructor() {}

  async getTransactionStatus(txHash) {
    try {
      let resp = await fetch(
        `${process.env.ETHERS_SCAN_API_URL}&txhash=${txHash}&apikey=${process.env.ETHERS_APIKEY}`
      );
      resp = await resp.json();
      if (resp.status == "0") {
        throw resp.result;
      }

      const status = resp?.result?.isError;
      const errMessage = resp?.result?.errDescription;

      console.log(`\n txHash: ${txHash} --- status: ${status}\n`);
      if (status == 1) throw errMessage;
      if (status == 0) return true;
    } catch (err) {
      throw err.message || err;
    }
  }

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
        include: [
          {
            model: db.script,
            include: [
              { model: db.user, attributes: { exclude: ["password"] } },
            ],
          },
        ],
      });
      totalPayments["music"] = await user.getMusicPayments({
        include: [
          {
            model: db.music,
            include: [
              { model: db.user, attributes: { exclude: ["password"] } },
            ],
          },
        ],
      });
      totalPayments["nft"] = await user.getNftPayments({
        include: [
          {
            model: db.nft,
            include: [
              {
                model: db.user,
                attributes: { exclude: ["password"] },
              },
            ],
          },
        ],
      });

      totalPayments.script.forEach((el, idx) => {
        totalPayments.script[idx] = includeAssociation
          ? el.script.dataValues
          : el.scriptId;
        el.script.isPaid = true;
      });
      totalPayments.music.forEach((el, idx) => {
        totalPayments.music[idx] = includeAssociation
          ? el.music.dataValues
          : el.musicId;
        el.music.isPaid = true;
      });
      totalPayments.nft.forEach((el, idx) => {
        totalPayments.nft[idx] = includeAssociation
          ? el.nft.dataValues
          : el.nftId;
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
