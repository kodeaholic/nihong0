const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { searchService } = require('../services');

const search = catchAsync(async (req, res) => {
    const result = await searchService.search(req.body);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Không có kết quả tương tự');
    }
    res.send(result);
});

module.exports = {
    search,
};
