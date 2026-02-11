// backend\models\Campaign.js
const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: String,
  subject: String,
  content: String,
  sender: String,
  recipients: [String],   // ADD THIS
  status: {
    type: String,
    enum: ['draft', 'sending', 'sent', 'paused'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  sentAt: Date,


  attachments: {
    images: [{ type: String }],
    videos: [{ type: String }],
    pdfs: [{ type: String }]
  }
});

module.exports = mongoose.model('Campaign', CampaignSchema);