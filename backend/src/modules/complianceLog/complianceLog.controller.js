const ComplianceLogService = require('./complianceLog.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await ComplianceLogService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const log = await ComplianceLogService.getById(req.params.id);
  successResponse(res, { data: log });
});

const create = catchAsync(async (req, res) => {
  const log = await ComplianceLogService.create(req.body, req.user.id);
  successResponse(res, { data: log }, 201, 'Compliance log created successfully');
});

const update = catchAsync(async (req, res) => {
  const log = await ComplianceLogService.update(req.params.id, req.body);
  successResponse(res, { data: log }, 200, 'Compliance log updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await ComplianceLogService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
