module.exports = function (sequelize, DataTypes) {
  return sequelize.define("role", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
  });
};
