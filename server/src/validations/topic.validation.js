const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTopic = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null, '')
  }),
};

const getTopic = {
    params: Joi.object().keys({
        topicId: Joi.string().custom(objectId),
    }),
};
const getTopics = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateTopic = {
  params: Joi.object().keys({
    topicId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null, '')
  })
};

const deleteTopic = {
  params: Joi.object().keys({
    topicId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTopic,
  getTopics,
  getTopic,
  updateTopic,
  deleteTopic,
};

