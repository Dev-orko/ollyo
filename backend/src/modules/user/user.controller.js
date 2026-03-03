const UserService = require('./user.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await UserService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const user = await UserService.getById(req.params.id);
  successResponse(res, { data: user });
});

const create = catchAsync(async (req, res) => {
  const user = await UserService.create(req.body);
  successResponse(res, { data: user }, 201, 'User created successfully');
});

const update = catchAsync(async (req, res) => {
  const user = await UserService.update(req.params.id, req.body);
  successResponse(res, { data: user }, 200, 'User updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await UserService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
