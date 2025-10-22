 
const Subscriber = require('../models/Subscriber');

// @desc    Add a new subscriber
// @route   POST /api/subscribers
// @access  Private
exports.addSubscriber = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if subscriber already exists
    const subscriberExists = await Subscriber.findOne({ email });
    if (subscriberExists) {
      return res.status(400).json({ message: 'Subscriber already exists' });
    }

    const subscriber = await Subscriber.create({ name, email });
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a subscriber

exports.deleteSubscriber = async (req, res) => {
  try {
    // Attempt to find and delete the subscriber
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      // Subscriber was not found (already deleted or wrong ID)
      return res.status(404).json({ message: 'Subscriber not found or already removed' });
    }

    // Successfully deleted
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
