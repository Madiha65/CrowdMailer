//C:\CrowdMailer\backend\config\testmail.js
require("dotenv").config();
const nodemailer = require("nodemailer");

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: "yourtestemail@gmail.com", 
      subject: "✅ Test Email from CrowdMailer",
      text: "If you see this, Gmail SMTP is working!",
    });

    console.log("✅ Test email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
})();
