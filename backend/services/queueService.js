// backend/services/queueService.js
const Queue = require('bull');
const path = require('path');
const emailService = require('./emailService');
const EmailLog = require('../models/EmailLog');
const Campaign = require('../models/Campaign');

// ✅ Define the Bull queue first
const emailQueue = new Queue('email sending', process.env.REDIS_URL);

// ✅ Process the queue jobs
emailQueue.process(async (job) => {
  const { campaignId, subscriberId, to, subject, html } = job.data;

  try {
    // Example: attach your images as inline CIDs
    const attachments = [
      {
        filename: 'image1.png',
        path: path.join(__dirname, '../uploads/1762520717640.png'),
        cid: 'image1@career'
      },
      {
        filename: 'image2.png',
        path: path.join(__dirname, '../uploads/1762520717652.png'),
        cid: 'image2@career'
      }
    ];

    // Replace local URLs in HTML with inline CID references
    const updatedHtml = html
      .replace('http://localhost:5000/uploads/1762520717640.png', 'cid:image1@career')
      .replace('http://localhost:5000/uploads/1762520717652.png', 'cid:image2@career');

    // ✅ Send email with attachments
    await emailService.sendEmail(to, subject, updatedHtml, attachments);

    // ✅ Log success
    await EmailLog.create({
      campaignId,
      subscriberId,
      status: 'sent',
      sentAt: new Date()
    });

    // ✅ Update campaign status
    await Campaign.findByIdAndUpdate(campaignId, { $set: { status: 'sent' } });

    return { status: 'sent' };
  } catch (error) {
    // ❌ Log failure
    await EmailLog.create({
      campaignId,
      subscriberId,
      status: 'failed',
      errorMessage: error.message,
      failedAt: new Date()
    });

    await Campaign.findByIdAndUpdate(campaignId, { $set: { status: 'failed' } });

    return { status: 'failed', error: error.message };
  }
});

// ✅ Export the queue so other files (e.g., controllers) can use it
module.exports = emailQueue;
