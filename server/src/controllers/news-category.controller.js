const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { newsCategoryService } = require('../services');

const createItem = catchAsync(async (req, res) => {
    const item = await newsCategoryService.createItem(req.body);
    res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['title']);
    if (filter.title) filter.title = new RegExp(filter.title, 'i') // this will add {title: /title/i} to filter to search by regex, not search by identical string comparison
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await newsCategoryService.queryItems(filter, options);
    res.send(result);
});

const getItem = catchAsync(async (req, res) => {
    const item = await newsCategoryService.getItemById(req.params.itemId);
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
    }
    res.send(item);
});

const updateItem = catchAsync(async (req, res) => {
    const item = await newsCategoryService.updateItemById(req.params.itemId, req.body);
    res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
    await newsCategoryService.deleteItemById(req.params.itemId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
};
