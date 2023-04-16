const db = require("../models/index");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

class OtpService {
  constructor() {
    this.schema = db.otpModel;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
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
    return otpGenerator.generate(6, {
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
    const currOtp = await this.schema.findOne({ where: { userId } });
    if (!currOtp) {
      const err = new Error();
      err.status = 404;
      err.message = "no user found or already verified";
      throw err;
    }
    return bcrypt.compareSync(otp, currOtp.otp);
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
