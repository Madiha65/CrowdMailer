const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass
      }
    });
  }

  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: emailConfig.from,
      to,
      subject,
      html
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();