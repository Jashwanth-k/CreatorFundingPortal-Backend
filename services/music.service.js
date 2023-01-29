const db = require("../models/index");
const fileService = require("./file.service");

class MusicService {
  constructor() {
    this.schema = db.music;
  }

  #buildFilter(filters) {
    const component = {};
    if (filters.userId) {
      component.userId = filters.userId;
    }
    component["price"] = {
      [db.Op.lte]: Number(filters["maxPrice"]) || Number.MAX_VALUE,
      [db.Op.gte]: Number(filters["minPrice"]) || Number.MIN_VALUE,
    };
    return component;
  }

  createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
  }

  async getAll(filters) {
    try {
      const buildfilters = this.#buildFilter(filters);
      const fetchData = await this.schema.findAll({
        where: buildfilters,
        include: db.user,
      });
      if (fetchData.length === 0)
        throw this.createError(404, "no musics found");

      const newData = fetchData.map((el) => {
        delete el.dataValues.user.dataValues.password;
        return el.dataValues;
      });
      newData.push({ message: "musics fetched successfully" });
      return newData;
    } catch (err) {
      throw err;
    }
  }

  async getOne(id, userId) {
    try {
      let fetchData = await this.schema.findOne({
        where: { id: id },
        include: db.user,
      });

      fetchData = fetchData?.dataValues;
      if (!fetchData) throw this.createError(404, "no music found");

      if (userId && fetchData.userId !== userId)
        throw this.createError(401, "resource doesn't belongs to the user");

      delete fetchData.user.dataValues.password;
      fetchData.message = "music fetched successfully";
      return fetchData;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const createRes = await this.schema.create(data);
      return createRes;
    } catch (err) {
      throw err;
    }
  }

  async update(data, id) {
    try {
      const updateRes = await this.schema.update(data, { where: { id: id } });

      if (updateRes[0] === 0)
        throw this.createError(404, "no music found with given id");

      return { message: "music updated successfully" };
    } catch (err) {
      // "unable to update music"
      throw err;
    }
  }

  async delete(id, userId, deleteAll) {
    try {
      if (deleteAll) {
        const toDelete = await this.getAll({ userId: userId });
        toDelete.forEach((el) => fileService.delete([el.image, el.audio]));
      } else {
        const toDelete = await this.getOne(id);
        if (toDelete.userId && toDelete.userId !== userId)
          throw this.createError(401, "resource doesn't belongs to the user");
        fileService.delete([toDelete.image, toDelete.audio]);
      }

      const deleteRes = await this.schema.destroy(
        deleteAll ? { where: { userId: userId } } : { where: { id: id } }
      );

      if (deleteRes === 0)
        throw this.createError(404, "no music found with given id");
      return { message: "music deleted successfully" };
    } catch (err) {
      // "unable to delete music"
      throw err;
    }
  }
}
const musicService = new MusicService();
module.exports = musicService;
