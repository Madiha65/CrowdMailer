const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Mailer connection error:", error);
//   } else {
//     console.log("✅ Mailer ready to send emails");
//   }
// });

// module.exports = transporter;

// backend/config/mailer.js
const sgMail = require('@sendgrid/mail');

let useSendGrid = false;
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  useSendGrid = true;
} else {
  console.info('ℹ️  SENDGRID_API_KEY not found or invalid. Falling back to SMTP (Nodemailer).');
}

const sendEmail = async (to, subject, html, attachments = []) => {
  if (useSendGrid) {
    const msg = {
      to: to,
      from: process.env.FROM_EMAIL,
      subject: subject,
      html: html,
      attachments: attachments,
    };

    try {
      await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid');
    } catch (error) {
      console.error('❌ Error sending email with SendGrid:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  } else {
    // Use Nodemailer transporter as fallback
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      html,
      attachments,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully via SMTP:', info && info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending email via SMTP:', error);
      throw error;
    }
  }
};

module.exports = { sendEmail };