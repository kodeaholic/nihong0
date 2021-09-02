const httpStatus = require('http-status');
const { News } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
/**
 * Create a item
 * @param {Object} itemBody
 * @returns {Promise<Board>}
 */
const createItem = async (itemBody) => {
  const item = await News.create(itemBody);
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
const queryItems = async (filter, options = { sortBy: 'createdAt:desc' }) => {
  const items = await News.paginate(filter, options);
  return items;
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Board>}
 */
const getItemById = async (id) => {
  return News.findById(id);
};

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} itemBody
 * @returns {Promise<Board>}
 */
const updateItemById = async (itemId, itemBody) => {
  let item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
  }

  const newParent = itemBody.parent;
  if (_.isEmpty(newParent)) {
    delete itemBody.parent;
    await News.updateOne({ _id: item._id }, { $unset: { parent: 1 } }); // remove old parent
  }
  item = await getItemById(itemId);
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

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
