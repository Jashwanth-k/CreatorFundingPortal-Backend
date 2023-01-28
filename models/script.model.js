module.exports = function (sequelize, DataTypes) {
  return sequelize.define("script", {
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
    script: {
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
  });
};
