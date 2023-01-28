module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "music",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageSource: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      audio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currencyType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { tableName: "musics" }
  );
};
