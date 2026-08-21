//backend\app.js
const express = require('express');
const cors = require('cors');
const path = require("path");
const connectDB = require('./config/db');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

connectDB().catch((err) => {
  console.error("Startup DB connection error:", err.message);
});

const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const subscriberRoutes = require("./routes/subscriberRoutes");
const emailRoutes = require('./routes/emailRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middleware/errorHandler');
const statsRoutes = require("./routes/statsRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://crowd-mailer-7d4h.vercel.app"
  ],
  credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
// app.js
app.use("/api/campaigns", campaignRoutes);   // ← add s
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api", emailRoutes);
app.use("/api/uploads", uploadRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(errorHandler);

module.exports = app;
