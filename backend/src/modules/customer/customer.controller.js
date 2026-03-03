const CustomerService = require('./customer.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await CustomerService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const customer = await CustomerService.getById(req.params.id);
  successResponse(res, { data: customer });
});

const create = catchAsync(async (req, res) => {
  const customer = await CustomerService.create(req.body);
  successResponse(res, { data: customer }, 201, 'Customer created successfully');
});

const update = catchAsync(async (req, res) => {
  const customer = await CustomerService.update(req.params.id, req.body);
  successResponse(res, { data: customer }, 200, 'Customer updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await CustomerService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
