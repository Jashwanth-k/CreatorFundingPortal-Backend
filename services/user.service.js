const db = require("../models/index");

class UserService {
  constructor() {
    this.schema = db.user;
  }

  create(user) {
    return this.schema.create(user);
  }

  getUserById(id) {
    return this.schema.findByPk(id);
  }

  getUserByEmail(email) {
    return this.schema.findOne({
      where: {
        email: email,
      },
    });
  }

  deleteUserByEmail(email) {
    return this.schema.destroy({
      where: {
        email: email,
      },
    });
  }

  update(id, data) {
    return this.schema.update(data, { where: { id: id } });
  }

  markVerified(id) {
    return this.update(id, { verified: true });
  }

  deleteUnverifiedUser(id) {
    setTimeout(() => {
      return this.schema.destroy({ where: { id: id, verified: false } });
    }, process.env.USER_EXPIRES_IN_SECONDS * 1000);
  }
}
const userService = new UserService();
module.exports = userService;
