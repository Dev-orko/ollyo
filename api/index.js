const path = require('path');

// Load env vars from backend .env if present (local dev)
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

const app = require('../backend/src/app');

module.exports = app;
