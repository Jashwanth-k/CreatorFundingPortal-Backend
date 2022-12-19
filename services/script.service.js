const db = require("../models/index");

class ScriptService {
  constructor() {
    this.schema = db.script;
  }

  async getAll() {
    try {
      const fetchData = await this.schema.findAll({ include: db.user });
      if (fetchData.length === 0) {
        return { message: "no scripts found" };
      }
      const newData = fetchData.map((el) => {
        delete el.dataValues.user.dataValues.password;
        return el.dataValues;
      });
      newData.push({ message: "scripts fetched successfully" });
      return newData;
    } catch (err) {
      throw { message: err };
    }
  }

  async getOne(id) {
    try {
      let fetchData = await this.schema.findOne({
        where: { id: id },
        include: db.user,
      });

      fetchData = fetchData?.dataValues;
      if (!fetchData) {
        return { message: "no script found" };
      }
      delete fetchData.user.dataValues.password;
      fetchData.message = "script fetched successfully";
      return fetchData;
    } catch (err) {
      throw { message: err };
    }
  }

  async create(data) {
    try {
      const createRes = await this.schema.create(data);
      return createRes;
    } catch (err) {
      throw { message: err };
    }
  }

  async update(data, id) {
    try {
      const updateRes = await this.schema.update(data, { where: { id: id } });

      if (updateRes[0] === 0) throw "unable to update script";
      return { message: "script updated successfully" };
    } catch (err) {
      throw { message: err };
    }
  }

  async delete(id) {
    try {
      const deleteRes = await this.schema.destroy({ where: { id: id } });

      if (deleteRes === 0) throw "unable to delete script";
      return { message: "script deleted successfully" };
    } catch (err) {
      throw { message: err };
    }
  }
}
const scriptService = new ScriptService();
module.exports = scriptService;
