const userService = require("../services/user.service");
const roleService = require("../services/role.service");
const jwtService = require("../services/jwt.service");
const bcrypt = require("bcrypt");
const { deleteUser } = require("../controllers/auth.controller");

class AuthService {
  constructor() {}

  async signUp(userData) {
    try {
      const rolesRes = await roleService.getRoleByName(userData.role);
      if (!rolesRes) {
        return [404, { message: "invalid role name" }];
      }
      const user = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: bcrypt.hashSync(userData.password, 8),
        roleId: rolesRes.id,
      };
      await userService.create(user);
      return [201, { message: "user created successfully" }];
    } catch (err) {
      throw err;
    }
  }

  async signIn(userData) {
    try {
      const user = await userService.getUserByEmail(
        userData.email.toLowerCase()
      );
      if (!user) {
        return [404, { message: "no user found with given email" }];
      }
      if (!bcrypt.compareSync(userData.password, user.password)) {
        return [401, { message: "incorrect password" }];
      }

      const role = await user.getRole();
      const payload = {
        email: user.email,
        role: role.name,
      };
      const token = await jwtService.createToken(payload);
      return [200, { message: "success", token: `Bearer ${token}` }];
    } catch (err) {
      throw err;
    }
  }

  async delete(userData) {
    try {
      const email = userData.email.toLowerCase();
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return [404, { message: "no user found with given email" }];
      }
      if (!bcrypt.compareSync(userData.password, user.password)) {
        return [401, { message: "incorrect password" }];
      }

      const deleteRes = await userService.deleteUserByEmail(email);
      if (deleteRes === 0) throw "unable to delete user";
      return [200, { message: "user deleted successfully" }];
    } catch (err) {
      throw err;
    }
  }
}

const authService = new AuthService();
module.exports = authService;
