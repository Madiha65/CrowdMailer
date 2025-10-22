// backend/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const emailRoutes = require('./routes/emailRoutes');
const statsRoutes = require('./routes/statsRoutes');  // ✅ only one import
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api', emailRoutes);
app.use('/api/stats', statsRoutes);       // ✅ keep this one
app.use('/api/campaigns', campaignRoutes);
app.use(errorHandler);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
