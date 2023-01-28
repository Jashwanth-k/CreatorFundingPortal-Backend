const db = require("../models/index");

class MusicService {
  constructor() {
    this.schema = db.music;
  }

  async getAll() {
    try {
      const fetchData = await this.schema.findAll({ include: db.user });
      if (fetchData.length === 0) {
        return [404, { message: "no musics found" }];
      }
      const newData = fetchData.map((el) => {
        delete el.dataValues.user.dataValues.password;
        return el.dataValues;
      });
      newData.push({ message: "musics fetched successfully" });
      return [200, newData];
    } catch (err) {
      throw err;
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
        return [404, { message: "no music found" }];
      }
      delete fetchData.user.dataValues.password;
      fetchData.message = "music fetched successfully";
      return [200, fetchData];
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const createRes = await this.schema.create(data);
      return [201, createRes];
    } catch (err) {
      throw err;
    }
  }

  async update(data, id) {
    try {
      const updateRes = await this.schema.update(data, { where: { id: id } });

      if (updateRes[0] === 0) {
        return [404, { message: "no music found with given id" }];
      }
      return [200, { message: "music updated successfully" }];
    } catch (err) {
      // "unable to update music"
      throw err;
    }
  }

  async delete(id, isUserId = false) {
    try {
      const deleteRes = await this.schema.destroy(
        isUserId ? { where: { userId: id } } : { where: { id: id } }
      );

      if (deleteRes === 0) {
        return [404, { message: "no music found with given id" }];
      }
      return [200, { message: "music deleted successfully" }];
    } catch (err) {
      // "unable to delete music"
      throw err;
    }
  }
}
const musicService = new MusicService();
module.exports = musicService;
