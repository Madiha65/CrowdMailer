const Queue = require('bull');
const emailService = require('./emailService');
const EmailLog = require('../models/EmailLog');
const Campaign = require('../models/Campaign');

const emailQueue = new Queue('email sending', process.env.REDIS_URL);

emailQueue.process(async (job) => {
  const { campaignId, subscriberId, to, subject, html } = job.data;
  
  try {
    // Send email
    await emailService.sendEmail(to, subject, html);
    
    // Log successful send
    await EmailLog.create({
      campaignId,
      subscriberId,
      status: 'sent'
    });
    
    // Update campaign stats
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { 'stats.totalSent': 1 }
    });
    
    return { status: 'sent' };
  } catch (error) {
    // Log failure
    await EmailLog.create({
      campaignId,
      subscriberId,
      status: 'failed',
      errorMessage: error.message
    });
    
    return { status: 'failed', error: error.message };
  }
});

module.exports = emailQueue;