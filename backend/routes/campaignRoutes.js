// backend/routes/campaignRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');

// Create a new campaign
router.post('/', auth, campaignController.createCampaign);

// Get all campaigns
router.get('/', auth, campaignController.getCampaigns);

// Get campaign by ID
router.get('/:id', auth, campaignController.getCampaignById);

// Send campaign
router.post('/:id/send', auth, campaignController.sendCampaign);

module.exports = router;
