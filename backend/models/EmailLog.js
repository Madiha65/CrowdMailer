//backend\models\EmailLog.js
const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
  status: { type: String, enum: ['sent', 'failed', 'opened', 'clicked', 'bounced'], default: 'sent' },
  sentAt: { type: Date, default: Date.now },
  openedAt: { type: Date },
  clickedAt: { type: Date },
  errorMessage: { type: String }
});

module.exports = mongoose.model('EmailLog', EmailLogSchema);