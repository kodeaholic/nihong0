const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCard = {
  body: Joi.object().keys({
    letter: Joi.string().required(),
    meaning: Joi.string().required(),
    note: Joi.string(),
    onText: Joi.string(),
    onTextExample: Joi.string(),
    kunText: Joi.string(),
    kunTextExample: Joi.string(),
    svgSrc: Joi.string().required(),
    code: Joi.string()
  }),
};

const getCards = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
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

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string(),
      name: Joi.string(),
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
  deleteCard
};
