const httpStatus = require('http-status');
const { News } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
const { htmlEntityDecode, htmlEntityEncode } = require('../helpers/htmlentities');
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
  const select = options.mobile ? ['-content'] : undefined;
  const items = await News.paginate(filter, options, select);
  return items;
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Board>}
 */
const getItemById = async (id, mobile = 0, clientWidth = 0) => {
  if (!mobile || !clientWidth) return News.findById(id);
  else {
    const item = await News.findById(id);
    if (!item) return undefined;
    const content = item.content ? htmlEntityDecode(item.content) : '';
    const html = `
      <html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet"><style>body{padding:0;margin:0}*{max-width:calc(100vw - 10px);outline:none;word-break:break-word}*{scroll-behavior:smooth;font-family:'Source Sans Pro',serif}*{scroll-behavior:smooth}main{font-family:'Source Sans Pro',serif;padding:10px 0 80px 0;width:calc(100vw);height:calc(100vh);display:flex;flex-direction:column;font-weight:normal;overflow-y:scroll;margin:0}.content{font-family:'Source Sans Pro',serif;font-weight:bold;line-height:220%;word-break:break-word}img{max-width:${clientWidth - 10}px;margin:5px;height:auto}</style></head><body cz-shortcut-listen="true"> <main><p style="font-family: 'Source Sans Pro', sans-serif; text-align: center; font-size: 20px; color: #5cdb5e; font-weight: bold;">${item.title}</p><div class="content">${content}</div> </main></body></html>
    `;
    // console.log(html);
    item.content = htmlEntityEncode(html);
    return item;
  }
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
