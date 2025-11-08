//backend\routes\campaignRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');
const upload = require('../config/multer'); 
const emailController = require('../controllers/emailController');


const uploadFiles = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 2 },
  { name: "pdfs", maxCount: 3 }
]);

// router.post("/", uploadFiles, campaignController.createCampaign);

// router.post("/", uploadFiles, campaignController.createCampaign);

// Create a new campaign with attachments
router.post('/', auth, campaignController.createCampaign);

// Get all campaigns
router.get('/', auth, campaignController.getCampaigns);

// Get campaign by ID
router.get('/:id', auth, campaignController.getCampaignById);

// Send campaign
// router.post('/:id/send', auth, campaignController.sendCampaign);

// backend/routes/campaignRoutes.js
router.delete('/:id', auth, campaignController.deleteCampaign);

// Send campaign email
router.post('/:id/send', auth, emailController.sendCampaign);




module.exports = router;
