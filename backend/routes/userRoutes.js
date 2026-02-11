// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

router.get('/profile',
  auth,
  allowRoles('admin', 'user'),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
