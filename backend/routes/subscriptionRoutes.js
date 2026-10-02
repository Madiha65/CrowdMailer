// backend/routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const c = require("../controllers/subscriptionController");

router.get("/me", auth, c.getMySubscription);
router.post("/activate", auth, c.activatePlan);

module.exports = router;
