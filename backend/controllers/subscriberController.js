 
const Subscriber = require('../models/Subscriber');


exports.addSubscriber = async (req, res) => {
  try {
    const { name, email } = req.body;

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

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found or already removed' });
    }
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
