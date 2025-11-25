const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/../.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) console.error("❌ Mailer connection error:", error);
  else console.log("✅ Mailer ready to send emails");
});

module.exports = transporter;
