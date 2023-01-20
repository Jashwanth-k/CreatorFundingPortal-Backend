const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const env = process.env.NODE_ENV;
const config = require("../config/config.json")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host,
  }
);

db.sequelize = sequelize;
db.script = require("./script.model")(sequelize, DataTypes);
db.music = require("../models/music.model")(sequelize, DataTypes);
db.nft = require("../models/nft.model")(sequelize, DataTypes);
db.user = require("../models/user.model")(sequelize, DataTypes);
db.role = require("../models/role.model")(sequelize, DataTypes);

db.user.hasMany(db.script);
db.script.belongsTo(db.user);

db.user.hasMany(db.music);
db.music.belongsTo(db.user);

db.user.hasMany(db.nft);
db.nft.belongsTo(db.user);

db.role.hasMany(db.user);
db.user.belongsTo(db.role);

module.exports = db;
