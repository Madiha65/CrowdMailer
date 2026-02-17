const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

let transporter = null;
let useSendGrid = false;

// Check for SendGrid API Key
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith("SG.")) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  useSendGrid = true;
  console.log("✅ SendGrid mailer active");
} else {
  console.log("ℹ️ Using SMTP mailer (Nodemailer)");

  // Create Nodemailer transporter
  // prioritizing SMTP_ vars if available, else falling back to EMAIL_ vars for Gmail
  const smtpConfig = {
    service: process.env.SMTP_SERVICE || "gmail", // default to gmail if not specified
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  };

  // If host/port are specified, use them (overrides service: "gmail" usually, but let's be explicit)
  if (process.env.SMTP_HOST) {
    delete smtpConfig.service;
    smtpConfig.host = process.env.SMTP_HOST;
    smtpConfig.port = Number(process.env.SMTP_PORT) || 587;
    smtpConfig.secure = process.env.SMTP_SECURE === "true";
  }

  transporter = nodemailer.createTransport(smtpConfig);

  // Verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ SMTP Connection Error:", error);
    } else {
      console.log("✅ SMTP Server is ready to take our messages");
    }
  });
}

const sendEmail = async (arg1, arg2, arg3) => {
  try {
    let toEmail, subject, html, attachments = [], fromEmail;

    // Handle different signatures:
    if (typeof arg1 === 'object' && arg1 !== null && !Array.isArray(arg1) && (arg1.to || arg1.email)) {
      const opts = arg1;
      toEmail = opts.to || opts.email;
      subject = opts.subject;
      html = opts.html || opts.content || opts.message;
      attachments = opts.attachments || [];
      fromEmail = opts.from;
    } else {
      toEmail = arg1;
      subject = arg2;
      html = arg3;
    }

    if (!fromEmail) {
      fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER;
    }

    console.log("DEBUG: sendEmail processed args:", {
      to: toEmail,
      subject,
      htmlExcerpt: html ? html.substring(0, 50) : "empty",
      attachmentCount: attachments.length
    });

    if (useSendGrid) {
      const msg = {
        to: toEmail,
        from: fromEmail,
        subject: subject || "No Subject",
        html: html || "<p>No content provided</p>",
        attachments
      };

      await sgMail.send(msg);
      console.log(`✅ Email sent to ${toEmail} via SendGrid`);
      return true;
    } else {
      if (!transporter) {
        throw new Error("Mailer not initialized (Check SMTP/SendGrid config)");
      }

      const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject || "No Subject",
        html: html || "<p>No content provided</p>",
        attachments
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${toEmail} via SMTP. MessageId: ${info.messageId}`);
      return info;
    }
  } catch (err) {
    console.error("❌ Email Send Error:", err.response?.body || err.message);
    // Don't swallow the error completely if you want the controller to count it as a fail
    throw err;
  }
};

module.exports = { sendEmail };