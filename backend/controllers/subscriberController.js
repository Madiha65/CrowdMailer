//C:\CrowdMailer\backend\controllers\subscriberController.js
const Subscriber = require('../models/Subscriber');
exports.addSubscriber = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const existing = await Subscriber.findOne({ email, owner: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Already subscribed!" });
    }
    const subscriber = await Subscriber.create({
      name: name || "Anonymous",
      email,
      owner: req.user.id,
      status: "active",
    });

    res.status(201).json({
      message: "✅ Subscribed successfully!",
      subscriber,
    });
  } catch (error) {
    console.error("❌ Subscription Error:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getSubscribers = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user.id };
    const subscribers = await Subscriber.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.owner = req.user.id;
    const subscriber = await Subscriber.findOneAndDelete(filter);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found or already removed' });
    }
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
