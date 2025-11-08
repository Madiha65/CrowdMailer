const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Fix here: use "/" instead of "/uploads"
router.post("/", upload.single("upload"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({ url: fileUrl, filename: req.file.filename });
});

module.exports = router;
