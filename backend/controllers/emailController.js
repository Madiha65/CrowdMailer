// backend\controllers\emailController.js

const nodemailer = require("nodemailer");
const Campaign = require("../models/Campaign");
const Subscriber = require("../models/Subscriber");
const EmailLog = require("../models/EmailLog"); 
const transporter = require("../config/mailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments({ status: "active" });
    const campaignsSent = await Campaign.countDocuments({ status: "sent" });

    const emailsSent = await EmailLog.countDocuments({ status: "sent" });
    const sentEmails = await EmailLog.countDocuments({ status: "sent" });
    const openedEmails = await EmailLog.countDocuments({ status: "opened" });
    const openRate = sentEmails > 0 ? Math.round((openedEmails / sentEmails) * 100) : 0;

    res.json({
      totalSubscribers,
      campaignsSent,
      emailsSent,
      openRate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendBulkEmail = async (req, res) => {
  try {
    const { from, emails, subject, html } = req.body;

    if (!from || !emails || emails.length === 0) {
      return res.status(400).json({ message: "Sender (from) and recipients are required." });
    }

    const sender = await Subscriber.findOne({ email: from });
    if (!sender) {
      return res.status(403).json({
        message: `The sender (${from}) is not subscribed. Please subscribe first before sending emails.`,
      });
    }

    if (sender.status !== "active") {
      return res.status(403).json({
        message: `Your subscription is not active. Please activate your subscription before sending emails.`,
      });
    }

    console.log(`📤 Sender ${from} is subscribed and active. Sending ${emails.length} emails...`);

    const batchSize = 10;
    let successCount = 0;
    let failCount = 0;
    const failedEmails = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (email) => {
          try {
            await transporter.sendMail({
              from: `"${sender.name || from}" <${process.env.FROM_EMAIL}>`,
              to: email,
              subject: subject,
              html: html,
            });

            await EmailLog.create({
              campaignId: null,
              subscriberId: sender._id, 
              status: "sent",
              sentAt: new Date(),
            });

            console.log(`✅ Sent to: ${email}`);
            successCount++;
          } catch (err) {
            console.error(`❌ Failed to send to ${email}: ${err.message}`);
            failCount++;
            failedEmails.push(email);
            
            await EmailLog.create({
              campaignId: null,
              subscriberId: sender._id, 
              status: "failed",
              sentAt: new Date(),
              errorMessage: err.message,
            });
          }
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    res.json({
      message: `✅ Sent ${successCount}/${emails.length} emails successfully.`,
      successCount,
      failCount,
      failedEmails,
    });

  } catch (error) {
    console.error("❌ Bulk Send Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const senderSubscriber = await Subscriber.findOne({ email: campaign.sender });
    if (!senderSubscriber || senderSubscriber.status !== "active") {
      return res.status(403).json({
        message: `The sender (${campaign.sender}) is not an active subscriber. Cannot send campaign.`,
      });
    }
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const attachments = [];
    let updatedHtml = campaign.content;
    let match;
    let cidIndex = 1;

    while ((match = imageRegex.exec(campaign.content)) !== null) {
      const imgUrl = match[1];
      if (imgUrl.includes("uploads/")) {
        const localPath = path.join(__dirname, "..", imgUrl.replace("http://localhost:5000/", ""));
        const cid = `img${cidIndex}@campaign`;
        updatedHtml = updatedHtml.replace(new RegExp(imgUrl, "g"), `cid:${cid}`);
        if (fs.existsSync(localPath)) {
          attachments.push({
            filename: path.basename(localPath),
            path: localPath,
            cid,
          });
        }
        cidIndex++;
      }
    }

    console.log(`📸 Found ${attachments.length} inline images to embed.`);

    const { recipients } = req.body;
    let recipientEmails = [];

    if (recipients && recipients.length > 0) {
      recipientEmails = recipients;
      console.log("📧 Sending to custom recipients:", recipientEmails.length);
    } else {
      const subscribers = await Subscriber.find({ status: "active" });
      recipientEmails = subscribers.map((s) => s.email);
      console.log("📧 Sending to active subscribers:", recipientEmails.length);
    }

    if (recipientEmails.length === 0) {
      return res.status(400).json({ message: "No recipients found." });
    }

    let successCount = 0;
    let failCount = 0;

    for (const email of recipientEmails) {
      try {
        await transporter.sendMail({
          from: `"${campaign.name}" <${process.env.FROM_EMAIL}>`,
          to: email,
          subject: campaign.subject,
          html: updatedHtml,
          attachments,
        });
        
        await EmailLog.create({
          campaignId: campaign._id,
          subscriberId: senderSubscriber._id,
          status: "sent",
          sentAt: new Date(),
        });
        
        successCount++;
        console.log(`✅ [SUCCESS] Email sent to: ${email}`);
      } catch (err) {
        failCount++;
        console.error(`❌ [FAILED] Could not send to: ${email}`);
        console.error(`   ↳ Reason: ${err.message}`);
        
        await EmailLog.create({
          campaignId: campaign._id,
          subscriberId: senderSubscriber._id,
          status: "failed",
          sentAt: new Date(),
          errorMessage: err.message,
        });
      }
      await new Promise((res) => setTimeout(res, 2000));
    }

    campaign.status = "sent";
    await campaign.save();

    console.log(`📨 Campaign summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   👥 Total: ${recipientEmails.length}`);

    res.json({
      message: `Campaign sent successfully to ${successCount}/${recipientEmails.length} recipients.`,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error("❌ Send Campaign Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendMultipleEmails = async (req, res) => {
  try {
    const { from, recipients, subject, html } = req.body;

    if (!from || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: "From, recipients, subject, and HTML are required." });
    }

    const sender = await Subscriber.findOne({ email: from });
    if (!sender) {
      return res.status(403).json({
        message: `The sender (${from}) is not subscribed. Please subscribe first before sending emails.`,
      });
    }

    if (sender.status !== "active") {
      return res.status(403).json({
        message: `Your subscription is not active. Please activate your subscription before sending emails.`,
      });
    }

    let successCount = 0;
    let failCount = 0;

    for (const to of recipients) {
      try {
        await transporter.sendMail({
          from: `"${sender.name || from}" <${process.env.FROM_EMAIL}>`,
          to,
          subject,
          html,
        });
        
        await EmailLog.create({
          campaignId: null, 
          subscriberId: sender._id,
          status: "sent",
          sentAt: new Date(),
        });

        successCount++;
        console.log(`✅ Email sent from ${from} → ${to}`);
      } catch (err) {
        failCount++;
        console.error(`❌ Failed to send to ${to}: ${err.message}`);
        
        await EmailLog.create({
          campaignId: null, 
          subscriberId: sender._id,
          status: "failed",
          sentAt: new Date(),
          errorMessage: err.message,
        });
      }

    }

    res.json({
      message: `✅ Sent ${successCount}/${recipients.length} emails successfully.`,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error("❌ Send Multiple Emails Error:", error);
    res.status(500).json({ error: error.message });
  }
};