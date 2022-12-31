module.exports = function (sequelize, DataTypes) {
  return sequelize.define("nft", {
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
      allowNull: false,
    },
    currencyType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
