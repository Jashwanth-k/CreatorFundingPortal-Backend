const jwt = require("jsonwebtoken");

class JwtService {
  createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  validateToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

const jwtService = new JwtService();
module.exports = jwtService;
