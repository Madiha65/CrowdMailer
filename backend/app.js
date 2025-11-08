const express = require('express');
const cors = require('cors');
const path = require("path");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const emailRoutes = require('./routes/emailRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); 
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const statsRoutes = require("./routes/statsRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://crowd-mailer.vercel.app"],
  credentials: true,
}));
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api', emailRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/campaigns', campaignRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
