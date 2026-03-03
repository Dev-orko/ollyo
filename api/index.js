const path = require('path');

// Load env vars from backend .env if present (local dev)
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

let app;
try {
  app = require('../backend/src/app');
} catch (err) {
  console.error('Failed to load app:', err);
  // Return a minimal handler that shows the error
  app = (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Server failed to start',
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
  };
}

module.exports = app;
