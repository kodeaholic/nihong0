const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trialTestService } = require('../services');

const createItem = catchAsync(async (req, res) => {
    const item = await trialTestService.createItem(req.body);
    res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title', 'level']);
    if (filter.title) filter.title = new RegExp(filter.title, 'i') // this will add {title: /title/i} to filter to search by regex, not search by identical string comparison
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await trialTestService.queryItems(filter, options);
    res.send(result);
});

const getItem = catchAsync(async (req, res) => {
    const item = await trialTestService.getItemById(req.params.itemId);
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
    }
    res.send(item);
});

const updateItem = catchAsync(async (req, res) => {
    const item = await trialTestService.updateItemById(req.params.itemId, req.body);
    res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
    await trialTestService.deleteItemById(req.params.itemId);
    res.status(httpStatus.NO_CONTENT).send();
});

const findTestByQuestion = catchAsync(async (req, res) => {
    const item = req.body.excludedId ? await trialTestService.findTestByQuestion(req.body.question, req.body.excludedId) : await trialTestService.findTestByQuestion(req.body.question);
    if (item) {
        res.send(item);
    } else {
        res.send({code: 404});
    }
});

module.exports = {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    findTestByQuestion
};
