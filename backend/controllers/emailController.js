//backend\controllers\emailController.js
const nodemailer = require("nodemailer");
const Campaign = require("../models/Campaign");
const Subscriber = require("../models/Subscriber");
const transporter = require("../config/mailer");

const fs = require("fs");
const path = require("path");
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

/**
 * 📧 Send a campaign email to all active subscribers
 * @route POST /api/campaigns/:id/send
 * @access Private
 */
exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // Get active subscribers
    const subscribers = await Subscriber.find({ status: "active" });
    if (subscribers.length === 0) {
      return res.status(400).json({ message: "No active subscribers to send emails to" });
    }

    // Extract image URLs from campaign.content
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const attachments = [];
    let updatedHtml = campaign.content;
    let match;
    let cidIndex = 1;

    while ((match = imageRegex.exec(campaign.content)) !== null) {
      const imgUrl = match[1];

      // Only process local URLs (e.g., localhost uploads)
      if (imgUrl.includes("uploads/")) {
        const localPath = path.join(__dirname, "..", imgUrl.replace("http://localhost:5000/", ""));
        const cid = `img${cidIndex}@campaign`;

        // Replace URL with cid in HTML
        updatedHtml = updatedHtml.replace(new RegExp(imgUrl, "g"), `cid:${cid}`);

        // Add attachment if file exists
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

    // Send emails to all active subscribers
    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: `"${campaign.name}" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: campaign.subject,
        html: updatedHtml,
        attachments,
      });
      console.log(`✅ Sent to ${subscriber.email}`);
    }

    // Update campaign status
    campaign.status = "sent";
    await campaign.save();

    res.json({
      message: `Campaign sent successfully to ${subscribers.length} recipients.`,
    });
  } catch (error) {
    console.error("❌ Send Campaign Error:", error);
    res.status(500).json({ error: error.message });
  }
};
