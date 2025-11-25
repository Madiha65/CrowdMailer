 //C:\CrowdMailer\backend\controllers\subscriberController.js
const Subscriber = require('../models/Subscriber');


exports.addSubscriber = async (req, res) => {
  try {
    const { name, email } = req.body;

    // 1️⃣ Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // 2️⃣ Check if already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Already subscribed!" });
    }

    // 3️⃣ Create new subscriber with active status
    const subscriber = await Subscriber.create({
      name: name || "Anonymous",
      email,
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
