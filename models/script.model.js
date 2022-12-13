module.exports = function (sequelize, DataTypes) {
  return sequelize.define("script", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    imageSource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currencyType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
