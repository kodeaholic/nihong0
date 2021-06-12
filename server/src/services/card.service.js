const httpStatus = require('http-status');
const { Card } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a card
 * @param {Object} cardBody
 * @returns {Promise<Card>}
 */
const createCard = async (cardBody) => {
  const card = await Card.create(cardBody);
  return card;
};

/**
 * Query for cards
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCards = async (filter, options) => {
  const cards = await Card.paginate(filter, options);
  return cards;
};

/**
 * Get card by id
 * @param {ObjectId} id
 * @returns {Promise<Card>}
 */
const getCardById = async (id) => {
  return Card.findById(id);
};

/**
 * Get card by code
 * @param {string} code
 * @returns {Promise<Card>}
 */
const getCardByCode = async (code) => {
  return Card.findOne({ code });
};

/**
 * Update card by id
 * @param {ObjectId} cardId
 * @param {Object} updateBody
 * @returns {Promise<Card>}
 */
const updateCardById = async (cardId, updateBody) => {
  const card = await getCardById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thẻ không tồn tại hoặc đã bị xoá');
  }
  if (updateBody.code && (await Card.isCodeTaken(updateBody.code, cardId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code đã tồn tại');
  }
  if (updateBody.letter && (await Card.isLetterTaken(updateBody.letter, cardId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chữ này đã tồn tại');
  }
  Object.assign(card, updateBody);
  await card.save();
  return card;
};

/**
 * Delete card by id
 * @param {ObjectId} cardId
 * @returns {Promise<Card>}
 */
const deleteCardById = async (cardId) => {
  const card = await getCardById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thẻ không tồn tại hoặc đã bị xoá');
  }
  await card.remove();
  return card;
};

module.exports = {
  createCard,
  queryCards,
  deleteCardById,
  getCardById,
  getCardByCode,
  updateCardById
};
