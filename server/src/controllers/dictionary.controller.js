const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dictionaryService } = require('../services');

const createItem = catchAsync(async (req, res) => {
  const item = await dictionaryService.createItem(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['phrase', 'lesson']);
  if (filter.phrase) filter.phrase = new RegExp(filter.phrase); // this will add {phrase: /phrase/i} to filter to search by regex, not search by identical string comparison
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await dictionaryService.queryItems(filter, options);
  res.send(result);
});

const getItem = catchAsync(async (req, res) => {
  const item = await dictionaryService.getItemById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
  }
  res.send(item);
});

const updateItem = catchAsync(async (req, res) => {
  const item = await dictionaryService.updateItemById(req.params.id, req.body);
  res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
  const item = await dictionaryService.deleteItemById(req.params.id);
  res.send(item);
});

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
