const DashboardService = require('./dashboard.service');
const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');

const getOverview = catchAsync(async (req, res) => {
  const data = await DashboardService.getOverview();
  successResponse(res, { data });
});

module.exports = { getOverview };
