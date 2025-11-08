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


router.post('/', auth, campaignController.createCampaign);

router.get('/', auth, campaignController.getCampaigns);

router.get('/:id', auth, campaignController.getCampaignById);

router.delete('/:id', auth, campaignController.deleteCampaign);

router.post('/:id/send', auth, emailController.sendCampaign);




module.exports = router;
