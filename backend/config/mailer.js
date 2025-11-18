// // backend/config/mailer.js
// const nodemailer = require("nodemailer");
// require("dotenv").config({ path: __dirname + "/../.env" });

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: parseInt(process.env.SMTP_PORT) || 587,
//   secure: process.env.SMTP_SECURE === "true", 
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false, 
//   },
// });

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

// Set the API key from the environment variable provided by the Render add-on
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html, attachments = []) => {
  const msg = {
    to: to, // Recipient
    from: process.env.FROM_EMAIL, // Must be a verified sender in your SendGrid account
    subject: subject,
    html: html,
    attachments: attachments,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent successfully via SendGrid");
  } catch (error) {
    console.error("❌ Error sending email with SendGrid:", error);
    // Log detailed error information from SendGrid if available
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

// We export a function that sends an email, not a transporter object
module.exports = { sendEmail };