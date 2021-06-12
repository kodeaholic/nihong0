const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cardService } = require('../services');

const createCard = catchAsync(async (req, res) => {
  const card = await cardService.createCard(req.body);
  res.status(httpStatus.CREATED).send(card);
});

const getCards = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await cardService.queryCards(filter, options);
  res.send(result);
});

const getCard = catchAsync(async (req, res) => {
  const card = await cardService.getCardById(req.params.cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thẻ không tồn tại hoặc đã bị xoá');
  }
  res.send(card);
});

const updateCard = catchAsync(async (req, res) => {
  const card = await cardService.updateCardById(req.params.cardId, req.body);
  res.send(card);
});

const deleteCard = catchAsync(async (req, res) => {
  await cardService.deleteCardById(req.params.cardId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCard,
  getCards,
  getCard,
  updateCard,
  deleteCard,
};
