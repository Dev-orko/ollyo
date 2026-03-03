const router = require('express').Router();
const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const { authenticate, authorize } = require('../../middleware/auth');
const {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require('./auth.validation');

// Public routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// Admin only - register new users
router.post(
  '/register',
  authenticate,
  authorize('ADMIN'),
  validate(registerSchema),
  authController.register
);

module.exports = router;
