const db = require("../models/index");

class UserService {
  constructor() {
    this.schema = db.user;
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
}
const userService = new UserService();
module.exports = userService;
