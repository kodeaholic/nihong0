const Joi = require('joi');
const { objectId } = require('./custom.validation');

const vocabSchemaValidation = Joi.object({
    vocab: Joi.string().required(),
    vocabMeaning: Joi.string().required(),
    example: Joi.string().allow(null, ''),
    exampleMeaning: Joi.string().allow(null, ''),
    vocabPronounce: Joi.string().allow(null, ''),
    examplePronounce: Joi.string().allow(null, ''),
    audioSrc: Joi.string().allow(null, ''),
  });
const lessonSchemaValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    meaning: Joi.string().allow(null, ''),
    audioSrc: Joi.string().allow(null, ''),
    vocab: Joi.array().items(vocabSchemaValidation)
  });
const chapterSchemaValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    meaning: Joi.string().allow(null, ''),
    lessons: Joi.array().items(lessonSchemaValidation)
  });

const createTopic = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    chapters: Joi.array().items(chapterSchemaValidation)
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
  body: Joi.object()
    .keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        chapters: Joi.array().items(chapterSchemaValidation)
    })
};

const deleteTopic = {
  params: Joi.object().keys({
    topicId: Joi.string().custom(objectId),
  }),
};

const deleteChapterByTopicIdChapterId = {
    params: Joi.object().keys({
      topicId: Joi.string().custom(objectId),
      chapterId: Joi.string().custom(objectId),
    }),
  };

const createChapterByTopicId = {
    params: Joi.object().keys({
        topicId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        lessons: Joi.array().items(lessonSchemaValidation)
    }),
};

const updateChapterByTopicIdChapterId = {
    params: Joi.object().keys({
        topicId: Joi.required().custom(objectId),
        chapterId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        meaning: Joi.string().allow(null, ''),
        lessons: Joi.array().items(lessonSchemaValidation)
    }),
};


module.exports = {
  createTopic,
  getTopics,
  getTopic,
  updateTopic,
  deleteTopic,
  deleteChapterByTopicIdChapterId,
  createChapterByTopicId,
  updateChapterByTopicIdChapterId
};

