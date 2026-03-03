// Vercel Serverless Function Entry Point
let app;
try {
  app = require('../backend/src/app');
} catch (err) {
  console.error('FATAL: Failed to load app:', err);
  app = (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Server failed to start',
      error: err.message,
      stack: err.stack,
    });
  };
}

module.exports = app;
