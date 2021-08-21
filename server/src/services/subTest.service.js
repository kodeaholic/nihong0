const httpStatus = require('http-status');
const { htmlEntityEncode } = require('../helpers/htmlentities');
const { SubTest } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
/**
 * Create a item
 * @param {Object} itemBody
 * @returns {Promise<Board>}
 */
const createItem = async (itemBody) => {
  const item = await SubTest.create(itemBody);
  return item;
};

/**
 * Query for items
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryItems = async (filter, options) => {
  const items = await SubTest.paginate(filter, options);
  return items;
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Board>}
 */
const getItemById = async (id) => {
  return SubTest.findById(id);
};

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} itemBody
 * @returns {Promise<Board>}
 */
const updateItemById = async (itemId, itemBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
  }
  Object.assign(item, itemBody);
  await item.save();
  return item;
};

/**
 * Delete item by id
 * @param {ObjectId} itemId
 * @returns {Promise<Board>}
 */
const deleteItemById = async (itemId) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
  }
  await item.remove();
  return item;
};

const findTestByQuestion = async (question, excludedId) => {
  const searchCondition = {
    quiz: {
      $elemMatch: {
        question: question,
      },
    },
  };
  if (excludedId) searchCondition._id = { $nin: [excludedId] };
  const item = await SubTest.findOne(searchCondition);
  return item;
};

const queryItemsByQuestion = async (filter) => {
  let searchCondition = {};
  if (!_.isEmpty(filter.title)) {
    searchCondition.title = { $regex: new RegExp(filter.title, 'i') };
  }
  if (!_.isEmpty(filter.question)) {
    searchCondition.quiz = {
      $elemMatch: {
        question: new RegExp(htmlEntityEncode(filter.question), 'i'),
      },
    };
  }
  if (!_.isEmpty(filter.level)) searchCondition.level = filter.level;
  if (!_.isEmpty(filter.type)) searchCondition.type = filter.type;
  else {
    searchCondition.type = {
      $in: [1, 2, 3, 4, 5],
    };
  }
  const items =
    filter.limit > 0 ? await SubTest.find(searchCondition).limit(limit) : await SubTest.find(searchCondition).limit(100);
  return items;
};

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
  findTestByQuestion,
  queryItemsByQuestion,
};
