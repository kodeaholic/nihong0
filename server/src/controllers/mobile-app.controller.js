const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const getMaintenanceMode = catchAsync(async (req, res) => {
  res.send({ maintenance: true });
});

module.exports = {
  getMaintenanceMode,
};
