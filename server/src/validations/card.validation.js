const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCard = {
  body: Joi.object().keys({
    letter: Joi.string().required(),
    meaning: Joi.string().required(),
    note: Joi.string().allow(null, ''),
    onText: Joi.string().allow(null, ''),
    onTextExample: Joi.string().allow(null, ''),
    kunText: Joi.string().allow(null, ''),
    kunTextExample: Joi.string().allow(null, ''),
    svgSrc: Joi.string().allow(null, ''),
    code: Joi.string()
  }),
};

const getCards = {
  query: Joi.object().keys({
    letter: Joi.string(),
    // code: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCard = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(objectId),
  }),
};

const updateCard = {
  params: Joi.object().keys({
    cardId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      letter: Joi.string().required(),
      meaning: Joi.string().required(),
      note: Joi.string().allow(null, ''),
      onText: Joi.string().allow(null, ''),
      onTextExample: Joi.string().allow(null, ''),
      kunText: Joi.string().allow(null, ''),
      kunTextExample: Joi.string().allow(null, ''),
      svgSrc: Joi.string().allow(null, ''),
      code: Joi.string()
    })
    .min(1),
};

const deleteCard = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getCards,
  createCard,
  getCard,
  updateCard,
  deleteCard
};
