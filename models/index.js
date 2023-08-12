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
    port: config.port,
    logging: false,
  }
);

db.sequelize = sequelize;
db.Op = Sequelize.Op;
db.script = require("./script.model")(sequelize, DataTypes);
db.music = require("../models/music.model")(sequelize, DataTypes);
db.nft = require("../models/nft.model")(sequelize, DataTypes);
db.user = require("../models/user.model")(sequelize, DataTypes);
db.role = require("../models/role.model")(sequelize, DataTypes);
db.favorite = require("../models/favorites.model")(sequelize, DataTypes);
db.musicPayment = require("../models/musicPayment.model")(sequelize, DataTypes);
db.scriptPayment = require("../models/scriptPayment.model")(
  sequelize,
  DataTypes
);
db.nftPayment = require("../models/nftPayment.model")(sequelize, DataTypes);
db.otpModel = require("../models/otp.model")(sequelize, DataTypes);

db.user.hasMany(db.script);
db.script.belongsTo(db.user);

db.user.hasMany(db.music);
db.music.belongsTo(db.user);

db.user.hasMany(db.nft);
db.nft.belongsTo(db.user);

db.role.hasMany(db.user);
db.user.belongsTo(db.role);

// SUPER MANY TO MANY RELATIONSHIPS
// MUSIC PAYMENTS
db.user.belongsToMany(db.music, {
  through: db.musicPayment,
  onDelete: "cascade",
});
db.music.belongsToMany(db.user, {
  through: db.musicPayment,
  onDelete: "cascade",
});

db.user.hasMany(db.musicPayment);
db.musicPayment.belongsTo(db.user);
db.music.hasMany(db.musicPayment);
db.musicPayment.belongsTo(db.music);

// SCRIPT PAYMENTS
db.user.belongsToMany(db.script, {
  through: db.scriptPayment,
  onDelete: "cascade",
});
db.script.belongsToMany(db.user, {
  through: db.scriptPayment,
  onDelete: "cascade",
});

db.user.hasMany(db.scriptPayment);
db.scriptPayment.belongsTo(db.user);
db.script.hasMany(db.scriptPayment);
db.scriptPayment.belongsTo(db.script);

// NFT PAYMENTS
db.user.belongsToMany(db.nft, {
  through: db.nftPayment,
  onDelete: "cascade",
});
db.nft.belongsToMany(db.user, {
  through: db.nftPayment,
  onDelete: "cascade",
});

db.user.hasMany(db.nftPayment);
db.nftPayment.belongsTo(db.user);
db.nft.hasMany(db.nftPayment);
db.nftPayment.belongsTo(db.nft);

db.user.hasOne(db.otpModel, {
  onDelete: "cascade",
});
db.otpModel.belongsTo(db.user);
module.exports = db;
