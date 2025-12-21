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


// backend/services/emailService.js
const sgMail = require('@sendgrid/mail');

// Set the API key from the environment variable provided by the Render add-on
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendEmail(to, subject, html, attachments = []) {
    const msg = {
      to: to, // Recipient's email address
      from: process.env.FROM_EMAIL, // Must be a verified sender in your SendGrid account
      subject: subject,
      html: html,
      attachments: attachments,
    };

    try {
      await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid');
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('❌ Error sending email with SendGrid:', error);
      // Log detailed error information from SendGrid if available
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }
}

module.exports = new EmailService();
