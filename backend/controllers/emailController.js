// backend/controllers/emailController.js
const nodemailer = require("nodemailer");
const Campaign = require("../models/Campaign");
const Subscriber = require("../models/Subscriber");
const EmailLog = require("../models/EmailLog");
const transporter = require("../config/mailer");
const User = require("../models/User");
const { PLANS, getEffectivePlan } = require("../config/plans");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments({ status: "active" });
    const campaignsSent = await Campaign.countDocuments({ status: "sent" });

    const sentEmails = await EmailLog.countDocuments({ status: "sent" });
    const openedEmails = await EmailLog.countDocuments({ status: "opened" });
    const openRate = sentEmails > 0 ? Math.round((openedEmails / sentEmails) * 100) : 0;

    res.json({
      totalSubscribers,
      campaignsSent,
      emailsSent: sentEmails,
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
      return res.status(400).json({ message: "Sender and recipients required." });
    }

    const sender = await Subscriber.findOne({ email: from });
    if (!sender)
      return res.status(403).json({ message: `Sender (${from}) is not subscribed.` });

    if (sender.status !== "active")
      return res.status(403).json({ message: "Subscription not active." });

    let successCount = 0;
    let failCount = 0;

    for (const email of emails) {
      try {
        await transporter.sendEmail({
          from: `"Bulk Mailer" <${from}>`,
          to: email,
          subject,
          html,
        });

        successCount++;
      } catch (err) {
        failCount++;
      }

      await new Promise((res) => setTimeout(res, 1000));
    }

    res.json({
      message: `Sent ${successCount}/${emails.length} emails`,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error("Bulk Send Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    // 1) Ownership: only the creator (or admin) can send
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You do not own this campaign." });
    }

    if (campaign.status === "sent") {
      return res.status(400).json({ message: "This campaign was already sent." });
    }

    // 2) Plan limit: free = 5 campaigns, then a paid plan is required
    const owner = await User.findById(campaign.createdBy);
    const plan = getEffectivePlan(owner);
    const limit = PLANS[plan].campaignLimit;
    if (owner.role !== "admin" && (owner.campaignsSent || 0) >= limit) {
      return res.status(403).json({
        code: "PLAN_LIMIT",
        message:
          plan === "free"
            ? `Free plan limit reached (${limit} campaigns). Please subscribe to a paid plan to send more.`
            : `${PLANS[plan].name} limit reached (${limit} campaigns). Please upgrade your plan.`,
        plan,
        limit,
        used: owner.campaignsSent || 0,
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
        const localPath = path.join(
          __dirname,
          "..",
          imgUrl.replace("http://localhost:5000/", "")
        );

        const cid = `img${cidIndex}@campaign`;
        updatedHtml = updatedHtml.replace(
          new RegExp(imgUrl, "g"),
          `cid:${cid}`
        );

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

    const recipientEmails = campaign.recipients;
    if (!recipientEmails || recipientEmails.length === 0) {
      return res.status(400).json({ message: "No recipients found." });
    }

    // 3) Sender: show the user's name, reply goes to the user's own email.
    // (SMTP/SendGrid only allow sending from your verified address, so the
    //  real "from" stays FROM_EMAIL and the user's email goes in Reply-To.)
    const senderEmail = campaign.sender || owner.email;
    const fromAddress = process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER;

    let successCount = 0;
    let failCount = 0;

    for (const email of recipientEmails) {
      try {
        await transporter.sendEmail({
          from: `"${owner.name} (${senderEmail})" <${fromAddress}>`,
          replyTo: senderEmail,
          to: email,
          subject: campaign.subject,
          html: updatedHtml,
          attachments,
        });

        successCount++;
        console.log("✅ Sent:", email);
      } catch (err) {
        console.log("❌ Failed:", email);
        console.log("Error:", err.message);
        failCount++;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    campaign.status = "sent";
    campaign.sentAt = new Date();
    campaign.sentCount = successCount;
    await campaign.save();

    // count it against the owner's plan (only if at least one mail went out)
    if (successCount > 0) {
      await User.updateOne({ _id: owner._id }, { $inc: { campaignsSent: 1 } });
    }

    res.json({
      message: `Campaign sent to ${successCount}/${recipientEmails.length}`,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error("Send Campaign Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// exports.sendCampaign = async (req, res) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id);
//     if (!campaign) return res.status(404).json({ message: "Campaign not found" });

//     const imageRegex = /<img[^>]+src="([^">]+)"/g;
//     const attachments = [];
//     let updatedHtml = campaign.content;
//     let match;
//     let cidIndex = 1;

//     while ((match = imageRegex.exec(campaign.content)) !== null) {
//       const imgUrl = match[1];
//       if (imgUrl.includes("uploads/")) {
//         const localPath = path.join(__dirname, "..", imgUrl.replace("http://localhost:5000/", ""));
//         const cid = `img${cidIndex}@campaign`;
//         updatedHtml = updatedHtml.replace(new RegExp(imgUrl, "g"), `cid:${cid}`);
//         if (fs.existsSync(localPath)) {
//           attachments.push({
//             filename: path.basename(localPath),
//             path: localPath,
//             cid,
//           });
//         }
//         cidIndex++;
//       }
//     }

//     const { recipients } = req.body;
//     let recipientEmails = [];

//     if (recipients && recipients.length > 0) {
//       recipientEmails = recipients;
//     } else {
//       const subscribers = await Subscriber.find({ status: "active" });
//       recipientEmails = subscribers.map((s) => s.email);
//     }

//     if (recipientEmails.length === 0) {
//       return res.status(400).json({ message: "No recipients found." });
//     }

//     let successCount = 0;
//     let failCount = 0;

//     for (const email of recipientEmails) {
//       try {
//         await transporter.sendMail({
//           from: `"${campaign.name}" <${process.env.FROM_EMAIL}>`,
//           to: email,
//           subject: campaign.subject,
//           html: updatedHtml,
//           attachments,
//         });
//         successCount++;
//       } catch (err) {
//         console.log("EMAIL FAILED:", email);
//         console.log("ERROR DETAILS:", err.message);
//         failCount++;
//       }

//       await new Promise((res) => setTimeout(res, 2000));
//     }

//     campaign.status = "sent";
//     await campaign.save();

//     console.log(`📨 Campaign summary:`);
//     console.log(`   ✅ Successful: ${successCount}`);
//     console.log(`   ❌ Failed: ${failCount}`);
//     console.log(`   👥 Total: ${recipientEmails.length}`);

//     res.json({
//       message: `Campaign sent to ${successCount}/${recipientEmails.length}`,
//       successCount,
//       failCount,
//     });
//   } catch (error) {
//     console.error("Send Campaign Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

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
        await transporter.sendEmail({
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