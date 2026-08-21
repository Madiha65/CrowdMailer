// backend/index.js
// This is the entry point Vercel uses (based on "main" in package.json).
// It only exports the Express app (no app.listen here) because Vercel
// runs it as a serverless function, not a long-running server.
module.exports = require('./app');
