const db = require("../models/index");
const fileService = require("./file.service");

class MusicService {
  constructor() {
    this.schema = db.nft;
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

  async getAll(filters, deleteAll) {
    try {
      const buildfilters = this.#buildFilter(filters);
      const fetchData = await this.schema.findAll({
        where: buildfilters,
        include: db.user,
      });
      if (!deleteAll && fetchData.length === 0)
        throw this.createError(404, "no nfts found");

      const newData = fetchData.map((el) => {
        delete el.dataValues.user.dataValues.password;
        return el.dataValues;
      });
      return newData;
    } catch (err) {
      throw err;
    }
  }

  async getOne(id, userId, deleteAll) {
    try {
      let fetchData = await this.schema.findOne({
        where: { id: id },
        include: db.user,
      });

      fetchData = fetchData?.dataValues;
      if (!deleteAll && !fetchData) throw this.createError(404, "no nft found");

      if (!deleteAll && userId && fetchData.userId !== userId)
        throw this.createError(401, "resource doesn't belongs to the user");

      delete fetchData.user.dataValues.password;
      fetchData.message = "nft fetched successfully";
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
        throw this.createError(404, "no nft found with given id");

      return { message: "nft updated successfully" };
    } catch (err) {
      // "unable to update music"
      throw err;
    }
  }

  async delete(id, userId, deleteAll) {
    try {
      if (deleteAll) {
        const toDelete = await this.getAll({ userId: userId }, true);
        toDelete.forEach((el) => fileService.delete([el.image]));
      } else {
        const toDelete = await this.getOne(id, userId, false);
        if (toDelete?.userId !== userId)
          throw this.createError(401, "resource doesn't belongs to the user");
        fileService.delete([toDelete.image]);
      }

      const deleteRes = await this.schema.destroy(
        deleteAll ? { where: { userId: userId } } : { where: { id: id } }
      );

      if (!deleteAll && deleteRes === 0)
        throw this.createError(404, "no nft found with given id");
      return { message: "nft deleted successfully" };
    } catch (err) {
      // "unable to delete music"
      throw err;
    }
  }
}
const musicService = new MusicService();
module.exports = musicService;
