const userService = require("../services/user.service");
const roleService = require("../services/role.service");
const jwtService = require("../services/jwt.service");
const bcrypt = require("bcrypt");
const scriptService = require("./script.service");
const musicService = require("./music.service");

class AuthService {
  constructor() {}
  createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
  }

  async signUp(userData) {
    try {
      const rolesRes = await roleService.getRoleByName(userData.role);
      if (!rolesRes) throw this.createError(404, "invalid role name");
      const userRes = await userService.getUserByEmail(
        userData.email.toLowerCase()
      );

      if (userRes) throw this.createError(409, "user eamil already exists");
      const user = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: bcrypt.hashSync(userData.password, 8),
        roleId: rolesRes.id,
      };
      await userService.create(user);
      return { message: "user created successfully" };
    } catch (err) {
      throw err;
    }
  }

  async signIn(userData) {
    try {
      const user = await userService.getUserByEmail(
        userData.email.toLowerCase()
      );
      if (!user) throw this.createError(404, "no user found with given email");

      if (!bcrypt.compareSync(userData.password, user.password))
        throw this.createError(401, "incorrect password");

      const role = await user.getRole();
      const payload = {
        id: user.id,
        email: user.email,
        role: role.name,
      };
      const token = await jwtService.createToken(payload);
      return { message: "success", token: `Bearer ${token}` };
    } catch (err) {
      throw err;
    }
  }

  async delete(userData) {
    try {
      const email = userData.email.toLowerCase();
      const user = await userService.getUserByEmail(email);
      if (!user) throw this.createError(404, "no user found with given email");

      if (!bcrypt.compareSync(userData.password, user.password))
        throw this.createError(401, "incorrect password");

      await scriptService.delete(false, user.id, true);
      await musicService.delete(false, user.id, true);
      const deleteRes = await userService.deleteUserByEmail(email);

      if (deleteRes === 0) throw "unable to delete user";
      return { message: "user account deleted successfully" };
    } catch (err) {
      throw err;
    }
  }
}

const authService = new AuthService();
module.exports = authService;
