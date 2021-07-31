const httpStatus = require('http-status');
const { extractTextFromHTMLString, extractFuriganaFromHTMLString } = require('../helpers/dom');
const { htmlEntityDecode } = require('../helpers/htmlentities');
const { Dictionary } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a vocab
 * @param {Object} requestBody
 * @returns {Promise<Dictionary>}
 */
const createItem = async (requestBody) => {
  const item = await Dictionary.create(requestBody);
  return item;
};

/**
 * Query for phrases
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryItems = async (filter, options) => {
  const items = await Dictionary.paginate(filter, options);
  return items;
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Vocab>}
 */
const getItemById = async (id) => {
  const item = await Dictionary.findById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
  }
  return item;
};

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<Vocab>}
 */
const updateItemById = async (itemId, updateBody) => {
  const item = await Dictionary.findById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mục không tồn tại hoặc đã bị xoá');
  }
  // const decoded = htmlEntityDecode(updateBody.item ? updateBody.item : '');
  // const extractedVocab = extractTextFromHTMLString(decoded);
  // const extractedFurigana = extractFuriganaFromHTMLString(decoded);
  // Object.assign(updateBody, { extractedVocab, extractedFurigana });
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

/**
 * Delete item by id
 * @param {ObjectId} itemId
 * @returns {Promise<Vocab>}
 */
const deleteItemById = async (itemId) => {
  const item = await Dictionary.findById(itemId);
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
