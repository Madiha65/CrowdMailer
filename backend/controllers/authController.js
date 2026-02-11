//backend\controllers\authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const TEST_PASSWORD = process.env.TEST_PASSWORD;



// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     if (TEST_PASSWORD && password !== TEST_PASSWORD) {
//       return res.status(400).json({
//         message: 'Use test password for live testing',
//       });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });

//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // ✅ Send welcome email, but don't block registration if it fails
    try {
      await emailService.sendEmail(email, "Welcome!", "<p>Welcome to CrowdMailer!</p>");
    } catch (err) {
      console.error("Email failed, but registration continues", err);
    }

    // Respond success
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (
      user &&
      TEST_PASSWORD &&
      password === TEST_PASSWORD
    ) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
