// backend/services/emailService.js
const mailer = require('../config/mailer');

module.exports = {
  sendEmail: async (to, subject, html, attachments = []) => {
    return mailer.sendEmail(to, subject, html, attachments);
  },
};