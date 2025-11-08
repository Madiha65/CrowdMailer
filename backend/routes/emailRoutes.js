//backend\routes\emailRoutes.js
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const auth = require('../middleware/auth');

router.get('/stats', auth, emailController.getStats);

module.exports = router;