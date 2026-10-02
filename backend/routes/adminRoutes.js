// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const User = require('../models/User');
const { getEffectivePlan } = require('../config/plans');

router.get('/dashboard', auth, allowRoles('admin'), (req, res) => {
  res.json({ message: "Admin Dashboard Data" });
});

// All users with their plan + usage
router.get('/users', auth, allowRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      plan: getEffectivePlan(u),
      planExpiresAt: u.planExpiresAt || null,
      campaignsSent: u.campaignsSent || 0,
      createdAt: u.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
