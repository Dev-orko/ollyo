const OrderService = require('./order.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await OrderService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const order = await OrderService.getById(req.params.id);
  successResponse(res, { data: order });
});

const create = catchAsync(async (req, res) => {
  const order = await OrderService.create(req.body);
  successResponse(res, { data: order }, 201, 'Order created successfully');
});

const update = catchAsync(async (req, res) => {
  const order = await OrderService.update(req.params.id, req.body);
  successResponse(res, { data: order }, 200, 'Order updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await OrderService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
