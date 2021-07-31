const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getItems = {
    query: Joi.object().keys({
      phrase: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  };

const getItem = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
const createItem = {
    body: Joi.object().keys({
        phrase: Joi.string().required(),
        meaning: Joi.string().allow(null, ''),
        example: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        exampleMeaning: Joi.string().allow(null, ''),
        furigana: Joi.string().allow(null, ''),
        extractedFurigana: Joi.string().allow(null, ''),
    }),
};

const updateItem = {
    params: Joi.object().keys({
        id: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        phrase: Joi.string().required(),
        meaning: Joi.string().allow(null, ''),
        example: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        exampleMeaning: Joi.string().allow(null, ''),
        furigana: Joi.string().allow(null, ''),
        extractedFurigana: Joi.string().allow(null, ''),
    }),
};

const deleteItem = {
    params: Joi.object().keys({
      id: Joi.string().custom(objectId),
    }),
  };

module.exports = {
  deleteItem,
  createItem,
  updateItem,
  getItem,
  getItems,
};

