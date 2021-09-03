const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createItem = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    parent: Joi.string().allow(null, ''),
    thumbnail: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
  }),
};

const getItems = {
  query: Joi.object().keys({
    title: Joi.string(),
    parent: Joi.string().custom(objectId).allow(null, ''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
    mobile: Joi.number().integer(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    mobile: Joi.number().integer(),
    clientWidth: Joi.number().integer(),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      content: Joi.string().allow(null, ''),
      parent: Joi.string().allow(null, ''),
      thumbnail: Joi.string().allow(null, ''),
      description: Joi.string().allow(null, ''),
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
