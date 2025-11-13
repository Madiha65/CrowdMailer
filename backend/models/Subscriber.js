const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
