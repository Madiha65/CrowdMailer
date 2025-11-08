// backend/config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

["uploads", "uploads/images", "uploads/videos", "uploads/pdfs", "uploads/others"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, "uploads/images");
    else if (file.mimetype.startsWith("video/")) cb(null, "uploads/videos");
    else if (file.mimetype === "application/pdf") cb(null, "uploads/pdfs");
    else cb(null, "uploads/others");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
