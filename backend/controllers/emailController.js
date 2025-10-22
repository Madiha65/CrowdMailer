 
const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const EmailLog = require('../models/EmailLog');

// @desc    Get campaign statistics
// @route   GET /api/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments({ status: 'active' });
    const campaignsSent = await Campaign.countDocuments({ status: 'sent' });
    const emailsSent = await EmailLog.countDocuments({ status: 'sent' });    
    // Calculate open rate
    const sentEmails = await EmailLog.countDocuments({ status: 'sent' });
    const openedEmails = await EmailLog.countDocuments({ status: 'opened' });
    const openRate = sentEmails > 0 ? Math.round((openedEmails / sentEmails) * 100) : 0;

    res.json({
      totalSubscribers,
      campaignsSent,
      emailsSent,
      openRate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};