const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');

// Admin sees totals for everyone, a normal user sees only their own numbers.
exports.getStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const campaignFilter = isAdmin ? {} : { createdBy: req.user.id };
    const subscriberFilter = isAdmin ? {} : { owner: req.user.id };

    const totalSubscribers = await Subscriber.countDocuments(subscriberFilter);
    const sentCampaigns = await Campaign.find({ ...campaignFilter, status: 'sent' }).select('sentCount');
    const campaignsSent = sentCampaigns.length;
    const emailsSent = sentCampaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);

    // Open tracking is not implemented yet, so don't show a fake number
    res.json({ totalSubscribers, campaignsSent, emailsSent, openRate: 0 });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
