const OpportunityService = require('./opportunity.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await OpportunityService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const opportunity = await OpportunityService.getById(req.params.id);
  successResponse(res, { data: opportunity });
});

const create = catchAsync(async (req, res) => {
  const opportunity = await OpportunityService.create(req.body);
  successResponse(res, { data: opportunity }, 201, 'Opportunity created successfully');
});

const update = catchAsync(async (req, res) => {
  const opportunity = await OpportunityService.update(req.params.id, req.body);
  successResponse(res, { data: opportunity }, 200, 'Opportunity updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await OpportunityService.delete(req.params.id);
  successResponse(res, { data: result });
});

module.exports = { getAll, getById, create, update, remove };
