const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getChapters = {
    query: Joi.object().keys({
      name: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      populate: Joi.string(),
      topic: Joi.string().custom(objectId)
    }),
  };

const getChapter = {
  params: Joi.object().keys({
    chapterId: Joi.string().custom(objectId),
  }),
};
const createChapter = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        topic: Joi.string().custom(objectId)
    }),
};

const updateChapter = {
    params: Joi.object().keys({
        chapterId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        topic: Joi.required().custom(objectId),
    }),
};

const deleteChapter = {
    params: Joi.object().keys({
      chapterId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
  deleteChapter,
  createChapter,
  updateChapter,
  getChapter,
  getChapters,
};

