const userService = require("./user.service");
const roleService = require("./role.service");
const jwtService = require("./jwt.service");
const bcrypt = require("bcrypt");
const scriptService = require("./script.service");
const musicService = require("./music.service");
const nftService = require("./nft.service");
const favoriteService = require("./favorite.service");

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

      if (userRes && !userRes.verified) {
        throw this.createError(400, "please verify your account");
      }
      if (userRes) throw this.createError(409, "user eamil already exists");
      const user = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: bcrypt.hashSync(userData.password, 8),
        roleId: rolesRes.id,
        account: userData.account,
      };
      const createUserRes = await userService.create(user);
      userService.deleteUnverifiedUser(createUserRes.id);
      return createUserRes;
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
      if (user && !user.verified) {
        throw this.createError(400, "please verify your account");
      }

      if (!bcrypt.compareSync(userData.password, user.password))
        throw this.createError(401, "incorrect password");

      const role = await user.getRole();
      const payload = {
        id: user.id,
        name: user.name,
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
      await nftService.delete(false, user.id, true);
      const deleteRes = await userService.deleteUserByEmail(email);

      if (deleteRes === 0) throw "unable to delete user";
      await favoriteService.deleteHelper(user.id, false);
      return { message: "user account deleted successfully" };
    } catch (err) {
      throw err;
    }
  }
}

const authService = new AuthService();
module.exports = authService;
