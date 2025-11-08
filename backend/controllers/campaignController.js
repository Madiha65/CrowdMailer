//backend\controllers\campaignController.js
const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const emailQueue = require('../services/queueService');
const upload = require('../config/multer'); // Multer config

const getFileUrls = (files) => {
  if (!files) return [];
  return files.map(file => `http://localhost:5000/${file.path.replace(/\\/g, '/')}`);
};
// Middleware for handling multipart/form-data
exports.uploadCampaignFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 2 },
  { name: 'pdfs', maxCount: 3 }
]);
// @desc    Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const recipients = req.body.recipients ? JSON.parse(req.body.recipients) : [];

    const campaign = new Campaign({
      name: req.body.name,
      subject: req.body.subject,
      content: req.body.content,
      recipients,
      subscriptionFee: req.body.subscriptionFee,
      images: [], // CKEditor handles uploads separately
      videos: [],
      pdfs: [],
      status: "draft", // ✅ Default status for new campaigns
      createdAt: new Date(),
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Create Campaign Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
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


// @desc    Send campaign to all subscribers
// @route   POST /api/campaigns/:id/send
// @access  Private
// exports.sendCampaign = async (req, res) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id);
//     if (!campaign) {
//       return res.status(404).json({ error: 'Campaign not found' });
//     }
    
//     // Update campaign status
//     campaign.status = 'sending';
//     await campaign.save();
    
//     // Get all active subscribers
//     const subscribers = await Subscriber.find({ status: 'active' });
    
//     // Add each email to the queue
//     subscribers.forEach(subscriber => {
//       // Personalize content
//       let personalizedContent = campaign.content
//         .replace(/{name}/g, subscriber.name)
//         .replace(/{email}/g, subscriber.email);
      
//       emailQueue.add({
//         campaignId: campaign._id,
//         subscriberId: subscriber._id,
//         to: subscriber.email,
//         subject: campaign.subject,
//         html: personalizedContent
//       });
//     });
    
//     res.json({ message: 'Campaign is being sent', recipients: subscribers.length });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    console.log("📤 Sending campaign:", campaign.name);

    const subscribers = await Subscriber.find({ status: "active" });
    console.log("Active subscribers:", subscribers.length);

    const recipientEmails = subscribers.map((s) => s.email);

    for (const email of recipientEmails) {
      console.log("Sending to:", email);
      await transporter.sendMail({
        from: `"${campaign.name}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: campaign.subject,
        html: campaign.content,
      });
    }

    campaign.status = "sent";
    await campaign.save();

    res.json({ message: "Campaign emails sent successfully!" });
  } catch (error) {
    console.error("❌ Send Campaign Error:", error);
    res.status(500).json({ error: error.message });
  }
};



// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
exports.deleteCampaign = async (req, res) => {
  try {
    console.log("🛠️ DELETE request received for campaign ID:", req.params.id); // ✅

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

