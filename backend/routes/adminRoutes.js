// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

router.get('/dashboard',
  auth,
  allowRoles('admin'),
  (req, res) => {
    res.json({ message: "Admin Dashboard Data" });
  }
);

router.get('/users',
  auth,
  allowRoles('admin'),
  (req, res) => {
    res.json({ message: "All users list (Admin only)" });
  }
);

module.exports = router;
