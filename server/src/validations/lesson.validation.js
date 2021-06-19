const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getLessons = {
    query: Joi.object().keys({
      name: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      populate: Joi.string(),
      chapter: Joi.string().custom(objectId)
    }),
  };

const getLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().custom(objectId),
  }),
};
const createLesson = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        chapter: Joi.string().custom(objectId).required(),

    }),
};

const updateLesson = {
    params: Joi.object().keys({
        lessonId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        chapter: Joi.required().custom(objectId),
    }),
};

const deleteLesson = {
    params: Joi.object().keys({
      lessonId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
  deleteLesson,
  createLesson,
  updateLesson,
  getLesson,
  getLessons,
};

