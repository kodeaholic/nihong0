const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const CompletedItem = {
  content: Joi.string().allow(null, ''),
  time: Joi.number().required(),
  program: Joi.string().allow(null, ''),
  level: Joi.string().allow(null, ''),
  itemId: Joi.string().allow(null, ''),
};

const Activity = {
  content: Joi.string().allow(null, ''),
  time: Joi.number().required(),
};

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
    completedItems: Joi.array().items(CompletedItem),
    activities: Joi.array().items(Activity),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    email: Joi.string(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      completedItems: Joi.array().items(CompletedItem),
      activities: Joi.array().items(Activity),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
