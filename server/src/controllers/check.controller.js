const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const isAuth = catchAsync(async (req, res) => {
    console.log(req)
  res.send({auth: true});
});

module.exports = {
  isAuth,
};
