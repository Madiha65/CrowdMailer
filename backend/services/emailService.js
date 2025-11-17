// // backend/services/emailService.js
// const nodemailer = require('nodemailer');
// const emailConfig = require('../config/emailConfig');

// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: emailConfig.host,
//       port: emailConfig.port,
//       secure: emailConfig.secure,
//       auth: {
//         user: emailConfig.auth.user,
//         pass: emailConfig.auth.pass
//       }
//     });
//   }

//   async sendEmail(to, subject, html, attachments = []) {
//     const mailOptions = {
//       from: emailConfig.from,
//       to,
//       subject,
//       html,
//       attachments
//     };

//     return this.transporter.sendMail(mailOptions);
//   }
// }

// module.exports = new EmailService();


const nodemailer = require('nodemailer');
// Instead of requiring a separate config file, use environment variables directly
// or ensure your emailConfig.js is properly configured

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Add timeout options
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });
  }

  async sendEmail(to, subject, html, attachments = []) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
      attachments
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
