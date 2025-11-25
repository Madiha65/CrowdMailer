// backend\models\Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, required: true }, // Add this field
  status: { type: String, enum: ['draft', 'sending', 'sent', 'paused'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
  stats: {
    totalSent: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 }
  },
  attachments: {
    images: [{ type: String }],
    videos: [{ type: String }],
    pdfs: [{ type: String }]
  }
});

module.exports = mongoose.model('Campaign', CampaignSchema);