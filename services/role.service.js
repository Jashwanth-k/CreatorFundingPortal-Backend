const db = require("../models/index");

class RoleService {
  constructor() {
    this.schema = db.role;
  }

  getRoleByName(name) {
    return this.schema.findOne({
      where: {
        name: name,
      },
    });
  }
}
const roleService = new RoleService();
module.exports = roleService;
