const ProductService = require('./product.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await ProductService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const product = await ProductService.getById(req.params.id);
  successResponse(res, { data: product });
});

const create = catchAsync(async (req, res) => {
  const product = await ProductService.create(req.body);
  successResponse(res, { data: product }, 201, 'Product created successfully');
});

const update = catchAsync(async (req, res) => {
  const product = await ProductService.update(req.params.id, req.body);
  successResponse(res, { data: product }, 200, 'Product updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await ProductService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
