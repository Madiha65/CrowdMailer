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


exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const subscribers = await Subscriber.find({ status: "active" });
    if (subscribers.length === 0) {
      return res.status(400).json({ message: "No active subscribers to send emails to" });
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

   for (const subscriber of subscribers) {
  try {
    await transporter.sendMail({
      from: `"${campaign.name}" <${process.env.FROM_EMAIL}>`,
      to: subscriber.email,
      subject: campaign.subject,
      html: updatedHtml,
      attachments,
    });
    console.log(`✅ Sent to: ${subscriber.email}`);
  } catch (err) {
    console.error(`❌ Failed to send to ${subscriber.email}:`, err.message);
  }

  // Wait 2 seconds between emails to avoid Gmail rate-limit
  await new Promise((res) => setTimeout(res, 2000));
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
