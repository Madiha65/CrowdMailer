const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const emailQueue = require('../services/queueService');

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
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
exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Update campaign status
    campaign.status = 'sending';
    await campaign.save();
    
    // Get all active subscribers
    const subscribers = await Subscriber.find({ status: 'active' });
    
    // Add each email to the queue
    subscribers.forEach(subscriber => {
      // Personalize content
      let personalizedContent = campaign.content
        .replace(/{name}/g, subscriber.name)
        .replace(/{email}/g, subscriber.email);
      
      emailQueue.add({
        campaignId: campaign._id,
        subscriberId: subscriber._id,
        to: subscriber.email,
        subject: campaign.subject,
        html: personalizedContent
      });
    });
    
    res.json({ message: 'Campaign is being sent', recipients: subscribers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};