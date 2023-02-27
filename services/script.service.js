const db = require("../models/index");
const fileService = require("./file.service");
const favoriteService = require("../services/favorite.service");

class ScriptService {
  constructor() {
    this.schema = db.script;
  }

  createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
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

  async getAll(filters, deleteAll) {
    try {
      const buildfilters = this.#buildFilter(filters);
      const fetchData = await this.schema.findAll({
        where: buildfilters,
        include: db.user,
      });
      if (!deleteAll && fetchData.length === 0)
        throw this.createError(404, "no scripts found");

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
      if (!deleteAll && !fetchData)
        throw this.createError(404, "no script found with given id");
      if (!deleteAll && userId && fetchData.userId !== userId)
        throw this.createError(401, "resource doesn't belongs to the user");

      delete fetchData.user.dataValues.password;
      fetchData.message = "script fetched successfully";
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
        throw this.createError(404, "no script found with given id");

      return { message: "script updated successfully" };
    } catch (err) {
      // "unable to update script"
      throw err;
    }
  }

  async delete(id, userId, deleteAll) {
    try {
      if (deleteAll) {
        const toDelete = await this.getAll({ userId: userId }, true);
        toDelete.forEach(async (el) => {
          fileService.delete([el.image, el.text]);
          await favoriteService.deleteHelper(userId, true, "script", el.id);
        });
      } else {
        const toDelete = await this.getOne(id, userId, false);
        if (toDelete.userId && toDelete.userId !== userId)
          throw this.createError(401, "resource doesn't belongs to the user");
        fileService.delete([toDelete.image, toDelete.text]);
        await favoriteService.deleteHelper(userId, true, "script", id);
      }

      const deleteRes = await this.schema.destroy(
        deleteAll ? { where: { userId: userId } } : { where: { id: id } }
      );

      if (!deleteAll && deleteRes === 0)
        throw this.createError(404, "no script found with given id");
      return { message: "script deleted successfully" };
    } catch (err) {
      // "unable to delete script"
      throw err;
    }
  }
}
const scriptService = new ScriptService();
module.exports = scriptService;
