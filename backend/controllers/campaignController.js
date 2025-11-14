//backend\controllers\campaignController.js
const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const emailQueue = require('../services/queueService');
const upload = require('../config/multer'); 
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
    const recipients = req.body.recipients ? JSON.parse(req.body.recipients) : [];
    const sender = req.body.sender; 
    if (!sender) {
      return res.status(400).json({ error: "Sender email is required" });
    }
    const senderSubscriber = await Subscriber.findOne({ email: sender });
    if (!senderSubscriber) {
      return res.status(403).json({
        message: `The sender (${sender}) is not subscribed. Please subscribe first before creating campaigns.`,
      });
    }

    if (senderSubscriber.status !== "active") {
      return res.status(403).json({
        message: `Your subscription is not active. Please activate your subscription before creating campaigns.`,
      });
    }

    const campaign = new Campaign({
      name: req.body.name,
      subject: req.body.subject,
      content: req.body.content,
      sender,
      recipients,
      subscriptionFee: req.body.subscriptionFee,
      images: [], 
      videos: [],
      pdfs: [],
      status: "draft",
      createdAt: new Date(),
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Create Campaign Error:", error);
    res.status(400).json({ error: error.message });
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

    console.log("📤 Sending campaign:", campaign.name);

    let recipientEmails = campaign.recipients;
    
    if (req.body.recipients && Array.isArray(req.body.recipients)) {
      recipientEmails = req.body.recipients;
    }

    if (recipientEmails.length === 0) {
      return res.status(400).json({ message: "No recipients found." });
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
        successCount++;
        console.log(`✅ [SUCCESS] Email sent to: ${email}`);
      } catch (err) {
        failCount++;
        console.error(`❌ [FAILED] Could not send to: ${email}`);
        console.error(`   ↳ Reason: ${err.message}`);
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
        to:subscribers.email,
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

