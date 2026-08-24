<<<<<<< HEAD
=======
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
//       from: emailConfig.from,class
//       to,
//       subject,
//       html,
//       attachments
//     };

//     return this.transporter.sendMail(mailOptions);
//   }
// }

// module.exports = new EmailService();
>>>>>>> f1980731a8528bb7132ddd14dd6056d6b284a58a


// Simple wrapper delegating to central mailer in config
const mailer = require('../config/mailer');

module.exports = {
  sendEmail: async (to, subject, html, attachments = []) => {
    return mailer.sendEmail(to, subject, html, attachments);
  }
};
