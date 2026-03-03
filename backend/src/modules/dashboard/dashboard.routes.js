const router = require('express').Router();
const dashboardController = require('./dashboard.controller');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.get('/', dashboardController.getOverview);

module.exports = router;
