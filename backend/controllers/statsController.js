const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const EmailLog = require('../models/EmailLog');
// backend/controllers/statsController.js
// @desc    Get campaign statistics
// @route   GET /api/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const campaignsSent = await Campaign.countDocuments();
    const emailsSent = await EmailLog.countDocuments();

    // Example open rate calculation (dummy logic, adjust as needed)
    const openRate = emailsSent
      ? ((emailsSent / (totalSubscribers || 1)) * 100).toFixed(2)
      : 0;

    res.json({
      totalSubscribers,
      campaignsSent,
      emailsSent,
      openRate,
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};