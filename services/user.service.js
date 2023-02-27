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
}
const userService = new UserService();
module.exports = userService;
