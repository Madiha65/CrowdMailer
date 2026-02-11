// backend/controllers/campaignController.js
const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const transporter = require('../config/email'); // your nodemailer config
const path = require('path');
const fs = require('fs');


// ================= CREATE CAMPAIGN =================
exports.createCampaign = async (req, res) => {
  try {
    const sender = req.body.sender;

    if (!sender) {
      return res.status(400).json({ error: "Sender email is required" });
    }

    const senderSubscriber = await Subscriber.findOne({ email: sender });

    if (!senderSubscriber) {
      return res.status(403).json({
        message: `The sender (${sender}) is not subscribed.`
      });
    }

    if (senderSubscriber.status !== "active") {
      return res.status(403).json({
        message: `Subscription not active.`
      });
    }

    const campaign = new Campaign({
      name: req.body.name,
      subject: req.body.subject,
      content: req.body.content,
      sender,
      status: "draft",
      createdAt: new Date()
    });

    await campaign.save();

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Create Campaign Error:", error);
    res.status(400).json({ error: error.message });
  }
};


// ================= SEND CAMPAIGN =================
exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const senderSubscriber = await Subscriber.findOne({ email: campaign.sender });

    if (!senderSubscriber || senderSubscriber.status !== "active") {
      return res.status(403).json({
        message: `Sender not active subscriber`
      });
    }

    console.log("📤 Sending campaign:", campaign.name);

    // Get all active subscribers
    const subscribers = await Subscriber.find({ status: "active" });

    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: `"${campaign.name}" <${process.env.EMAIL_USER}>`,
          to: sub.email,
          subject: campaign.subject,
          html: campaign.content
        });

        successCount++;
        console.log("Sent to:", sub.email);
      } catch (err) {
        failCount++;
        console.error("Failed:", sub.email, err.message);
      }

      await new Promise(r => setTimeout(r, 1500));
    }

    campaign.status = "sent";
    campaign.sentAt = new Date();
    await campaign.save();

    res.json({
      message: "Campaign sent",
      success: successCount,
      failed: failCount
    });

  } catch (error) {
    console.error("Send Campaign Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ALL =================
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ONE =================
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


// ================= DELETE =================
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.deleteOne();

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
