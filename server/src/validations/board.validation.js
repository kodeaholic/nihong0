const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBoard = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    level: Joi.string().allow(null, ''),
    cards: Joi.array().required(),
    free: Joi.boolean().required()
  }),
};

const getBoards = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string()
  }),
};

const getBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
};

const updateBoard = {
  params: Joi.object().keys({
    boardId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      description: Joi.string().allow(null, ''),
      level: Joi.string().allow(null, ''),
      cards: Joi.array().required(),
      free: Joi.boolean().required()
    })
    .min(1),
};

const deleteBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
};

const checkTagsForCards = {
  body: Joi.object().keys({
    letters: Joi.array().required()
  })
}
module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  checkTagsForCards
};
