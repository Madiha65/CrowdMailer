const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

// same email may exist for different users, but only once per user
subscriberSchema.index({ owner: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Subscriber", subscriberSchema);
