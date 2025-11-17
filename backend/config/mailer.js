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


const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/../.env" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add these timeout options to prevent connection timeouts
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 60000,    // 60 seconds
  // Keep the TLS configuration but consider if you really need rejectUnauthorized: false
  tls: {
    rejectUnauthorized: false, 
  },
});

// Only verify connection in development, not in production
if (process.env.NODE_ENV !== 'production') {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Mailer connection error:", error);
    } else {
      console.log("✅ Mailer ready to send emails");
    }
  });
}

module.exports = transporter;