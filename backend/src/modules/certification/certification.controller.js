const CertificationService = require('./certification.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getAll = catchAsync(async (req, res) => {
  const result = await CertificationService.getAll(req.query);
  successResponse(res, result);
});

const getById = catchAsync(async (req, res) => {
  const certification = await CertificationService.getById(req.params.id);
  successResponse(res, { data: certification });
});

const create = catchAsync(async (req, res) => {
  const certification = await CertificationService.create(req.body);
  successResponse(res, { data: certification }, 201, 'Certification created successfully');
});

const update = catchAsync(async (req, res) => {
  const certification = await CertificationService.update(req.params.id, req.body);
  successResponse(res, { data: certification }, 200, 'Certification updated successfully');
});

const remove = catchAsync(async (req, res) => {
  const result = await CertificationService.delete(req.params.id);
  successResponse(res, { data: result });
});

const getExpiringSoon = catchAsync(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const certifications = await CertificationService.getExpiringSoon(days);
  successResponse(res, { data: certifications });
});

module.exports = { getAll, getById, create, update, remove, getExpiringSoon };
