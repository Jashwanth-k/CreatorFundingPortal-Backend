const { Sequelize, DataTypes } = require("Sequelize");
const env = process.env.database || "development";
const config = require("../config/config.json")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
  }
);

db.sequelize = sequelize;
db.script = require("../models/scripts.model")(sequelize, DataTypes);

module.exports = db;
