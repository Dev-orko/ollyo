const SupplierService = require('./supplier.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await SupplierService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const supplier = await SupplierService.getById(req.params.id);
  successResponse(res, { data: supplier });
});

const create = catchAsync(async (req, res) => {
  const supplier = await SupplierService.create(req.body);
  successResponse(res, { data: supplier }, 201, 'Supplier created successfully');
});

const update = catchAsync(async (req, res) => {
  const supplier = await SupplierService.update(req.params.id, req.body);
  successResponse(res, { data: supplier }, 200, 'Supplier updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await SupplierService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
