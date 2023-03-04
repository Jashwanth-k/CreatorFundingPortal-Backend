const userService = require("../services/user.service");
const db = require("../models/index");

class FavoriteService {
  constructor() {
    this.schema = db.favorite;
  }
  createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
  }

  async findOne(userId, componentId, type) {
    const cond = { userId: userId };
    cond[`${type}Id`] = componentId;
    return this.schema.findOne({
      where: cond,
    });
  }

  async findAll(userId) {
    try {
      const user = await userService.getUserById(userId);
      if (!user) throw this.createError(404, "no user found with given id");
      const components = await this.schema.findAll({
        where: { userId: userId },
      });
      const music = new Set(),
        script = new Set(),
        nft = new Set();
      components.forEach((el) => {
        if (el.scriptId) script.add(el.scriptId);
        if (el.musicId) music.add(el.musicId);
        if (el.nftId) nft.add(el.nftId);
      });

      return {
        music,
        script,
        nft,
      };
    } catch (err) {
      throw err;
    }
  }

  async create(userId, componentId, type) {
    try {
      const user = await userService.getUserById(userId);
      if (!user) throw this.createError(404, "no user found with given id");
      const searchData = await this.findOne(userId, componentId, type);
      if (searchData) {
        throw this.createError(409, `${type} is already present in favorites`);
      }

      const compKey = `${type}Id`;
      const data = { userId: userId };
      data[compKey] = componentId;
      await this.schema.create(data);
      return { message: `${type} added to favorites successfully` };
    } catch (err) {
      throw err;
    }
  }

  async deleteHelper(userId, deleteOne, type, componentId) {
    const cond = {};
    if (userId) cond["userId"] = userId;
    if (deleteOne) cond[`${type}Id`] = componentId;
    await this.schema.destroy({
      where: cond,
    });
  }

  async delete(userId, componentId, type) {
    try {
      const user = await userService.getUserById(userId);
      if (!user) throw this.createError(404, "no user found with given id");
      const searchData = await this.findOne(userId, componentId, type);
      if (!searchData) {
        throw this.createError(404, `${type} is not present in favorites`);
      }

      await this.deleteHelper(userId, true, type, componentId);
      return { message: `${type} removed from favorites successfully` };
    } catch (err) {
      throw err;
    }
  }
}

const favoriteService = new FavoriteService();
module.exports = favoriteService;
