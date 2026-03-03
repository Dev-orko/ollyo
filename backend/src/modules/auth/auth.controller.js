const AuthService = require('./auth.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  successResponse(res, { data: result }, 200, 'Login successful');
});

const register = catchAsync(async (req, res) => {
  const user = await AuthService.register(req.body);
  successResponse(res, { data: user }, 201, 'User registered successfully');
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthService.refreshToken(req.body.refreshToken);
  successResponse(res, { data: result }, 200, 'Token refreshed successfully');
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  successResponse(res, { data: result }, 200, 'Password changed successfully');
});

const getProfile = catchAsync(async (req, res) => {
  const user = await AuthService.getProfile(req.user.id);
  successResponse(res, { data: user });
});

module.exports = {
  login,
  register,
  refreshToken,
  changePassword,
  getProfile,
};
