module.exports = function (sequelize, DataTypes) {
  return sequelize.define("otpdata", {
    otp: {
      type: DataTypes.STRING,
    },
  });
};
