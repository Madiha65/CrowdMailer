// backend/services/queueService.js
const Queue = require('bull');
const path = require('path');
const emailService = require('./emailService');
const EmailLog = require('../models/EmailLog');
const Campaign = require('../models/Campaign');

const emailQueue = new Queue('email sending', process.env.REDIS_URL);

emailQueue.process(async (job) => {
  const { campaignId, subscriberId, to, subject, html } = job.data;

  try {
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

    const updatedHtml = html
      .replace('http://localhost:5000/uploads/1762520717640.png', 'cid:image1@career')
      .replace('http://localhost:5000/uploads/1762520717652.png', 'cid:image2@career');

    await emailService.sendEmail(to, subject, updatedHtml, attachments);

    await EmailLog.create({
      campaignId,
      subscriberId,
      status: 'sent',
      sentAt: new Date()
    });

    await Campaign.findByIdAndUpdate(campaignId, { $set: { status: 'sent' } });

    return { status: 'sent' };
  } catch (error) {
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

module.exports = emailQueue;
