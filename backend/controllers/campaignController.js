//backend\controllers\campaignController.js
const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const emailQueue = require('../services/queueService');
const upload = require('../config/multer');
// const transporter = require("../config/mailer");
const mailer = require("../config/mailer");
const fs = require("fs");
const path = require("path");



const getFileUrls = (files) => {
  if (!files) return [];
  return files.map(file => `http://localhost:5000/${file.path.replace(/\\/g, '/')}`);
};
exports.uploadCampaignFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 2 },
  { name: 'pdfs', maxCount: 3 }
]);

exports.createCampaign = async (req, res) => {
  try {
    console.log("------- CREATE CAMPAIGN DEBUG -------");
    console.log("User:", req.user?.email);
    console.log("Raw Body:", JSON.stringify(req.body, null, 2));

    // Fix: Handle both 'recipients' (API) and 'recipientEmails' (Frontend) keys
    let recipientsInput = req.body.recipients || req.body.recipientEmails;

    console.log("Recipients Input:", recipientsInput, "Type:", typeof recipientsInput);

    let recipients = [];
    if (recipientsInput) {
      if (Array.isArray(recipientsInput)) {
        recipients = recipientsInput;
      } else if (typeof recipientsInput === 'string') {
        try {
          recipients = JSON.parse(recipientsInput);
        } catch (e) {
          console.error("Failed to parse recipients string:", e.message);
          recipients = [recipientsInput]; // Fallback if regular string
        }
      } else {
        console.warn("Unknown recipients format");
      }
    }

    console.log("Final Recipients Array:", recipients);

    const sender = req.user.email;

    // Fix: Map title->name and message->content if they differ
    const campaign = new Campaign({
      name: req.body.name || req.body.title,
      subject: req.body.subject,
      content: req.body.content || req.body.message,
      sender,
      recipients,
      subscriptionFee: req.body.subscriptionFee,
      status: "draft",
      createdAt: new Date(),
    });

    await campaign.save(); res.status(201).json(campaign);
  } catch (error) { console.error("Create Campaign Error:", error); res.status(400).json({ error: error.message }); }
};

exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const subscribers = await Subscriber.find({ status: "active" });
    const recipientEmails = subscribers.map(s => s.email);

    if (recipientEmails.length === 0) {
      return res.status(400).json({ message: "No active subscribers found." });
    }

    let successCount = 0;
    let failCount = 0;

    for (const email of recipientEmails) {
      try {
        await mailer.sendEmail(
          email,
          campaign.subject,
          campaign.content
        );

        console.log("✅ Sent:", email);
        successCount++;
      } catch (err) {
        console.log("❌ Failed:", email);
        console.log(err.message);
        failCount++;
      }

      await new Promise(res => setTimeout(res, 1500));
    }

    campaign.status = "sent";
    await campaign.save();

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

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteCampaign = async (req, res) => {
  try {
    console.log("🛠️ DELETE request received for campaign ID:", req.params.id);

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      console.log("❌ Campaign not found for ID:", req.params.id);
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.deleteOne();
    console.log("✅ Campaign deleted successfully:", req.params.id);

    res.json({ message: 'Campaign deleted successfully' });

  } catch (error) {
    console.error("🔥 Delete Campaign Error:", error);
    res.status(500).json({ error: error.message });
  }
};

