// const express = require('express');
// const router = express.Router();
// const subscriberController = require('../controllers/subscriberController');
// const auth = require('../middleware/auth');

// router.post('/', auth, subscriberController.addSubscriber);
// router.get('/', auth, subscriberController.getSubscribers);
// router.delete('/:id', auth, subscriberController.deleteSubscriber);

// module.exports = router;
// C:\CrowdMailer\backend\routes\subscriberRoutes.js
const express = require("express");
const router = express.Router();
const subscriberController = require("../controllers/subscriberController");

// POST /api/subscribe - Add new subscriber
router.post("/subscribe", subscriberController.addSubscriber);

// GET /api/subscribers - Get all subscribers
router.get("/subscribers", subscriberController.getSubscribers);

// DELETE /api/subscribers/:id - Delete subscriber
router.delete("/subscribers/:id", subscriberController.deleteSubscriber);

module.exports = router;
