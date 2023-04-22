const db = require("../models/index");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userService = require("./user.service");

class OtpService {
  constructor() {
    this.schema = db.otpModel;
    this.initializeTransporter();
  }

  createError(status, message) {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE_PROVIDER,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  generateOtp(len = process.env.OTP_LEN) {
    return otpGenerator.generate(len, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  }

  addOtpToDb(userId, otp) {
    otp = bcrypt.hashSync(otp, 8);
    return this.schema.create({ userId: userId, otp });
  }

  async verifyOtp(userId, otp) {
    try {
      const currOtp = await this.schema.findOne({ where: { userId } });
      const user = await userService.getUserById(userId);
      if (!currOtp && user) {
        throw this.createError(200, "user already verified");
      }
      if (!currOtp) {
        throw this.createError(404, "no user found or otp expired");
      }
      return bcrypt.compareSync(otp, currOtp.otp);
    } catch (err) {
      throw err;
    }
  }

  deleteOtp(userId) {
    return this.schema.destroy({ where: { userId } });
  }

  async sendEmailOtp(email, otp) {
    try {
      return await this.transporter.sendMail({
        from: process.env.MAIL_SENDER_ADDRESS,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Enter <strong>OTP ${otp}</strong> in app to verify your account<br><br>otp expires in <strong>${Math.floor(
          process.env.USER_EXPIRES_IN_SECONDS / 60
        )} minutes</strong></p>`,
      });
    } catch (err) {
      throw err;
    }
  }
}

const otpService = new OtpService();
module.exports = otpService;
