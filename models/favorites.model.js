module.exports = function (sequelize, DataTypes) {
  return sequelize.define("favorites", {
    userId: {
      type: DataTypes.BIGINT,
    },
    scriptId: {
      type: DataTypes.BIGINT,
    },
    musicId: {
      type: DataTypes.BIGINT,
    },
    nftId: {
      type: DataTypes.BIGINT,
    },
  });
};
