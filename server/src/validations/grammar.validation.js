const Joi = require('joi');
const { objectId } = require('./custom.validation');

const QuizValidation = {
  question: Joi.string().required(),
  A: Joi.string().required(),
  B: Joi.string().required(),
  C: Joi.string().required(),
  D: Joi.string().required(),
  answer: Joi.string().required(),
}

const createItem = {
  body: Joi.object().keys({
    name: Joi.string().allow(null, ''),
    title: Joi.string().required(),
    level: Joi.string().allow(null, ''),
    content: Joi.string().allow(null, ''),
    meaning: Joi.string().allow(null, ''),
    usage: Joi.string().allow(null, ''),
    example: Joi.string().allow(null, ''),
    free: Joi.number().required(),
    quiz: Joi.array().items(QuizValidation)
  }),
};

const getItems = {
  query: Joi.object().keys({
    title: Joi.string(),
    level: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        name: Joi.string().allow(null, ''),
        title: Joi.string().required(),
        level: Joi.string().allow(null, ''),
        content: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        usage: Joi.string().allow(null, ''),
        example: Joi.string().allow(null, ''),
        free: Joi.number().required(),
        quiz: Joi.array().items(QuizValidation)
    })
    .min(1),
};
const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
