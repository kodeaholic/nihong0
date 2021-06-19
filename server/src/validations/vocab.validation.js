const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getVocabs = {
    query: Joi.object().keys({
      vocab: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      populate: Joi.string(),
      lesson: Joi.string().custom(objectId)
    }),
  };

const getVocab = {
  params: Joi.object().keys({
    vocabId: Joi.string().custom(objectId),
  }),
};
const createVocab = {
    body: Joi.object().keys({
        vocab: Joi.string().required(),
        chinese: Joi.string().allow(null, ''),
        vocabMeaning: Joi.string().allow(null, ''),
        example: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        exampleMeaning: Joi.string().allow(null, ''),
        lesson: Joi.string().custom(objectId).required(),

    }),
};

const updateVocab = {
    params: Joi.object().keys({
        vocabId: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        vocab: Joi.string().required(),
        chinese: Joi.string().allow(null, ''),
        vocabMeaning: Joi.string().allow(null, ''),
        example: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        exampleMeaning: Joi.string().allow(null, ''),
        lesson: Joi.required().custom(objectId),
    }),
};

const deleteVocab = {
    params: Joi.object().keys({
      vocabId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
  deleteVocab,
  createVocab,
  updateVocab,
  getVocab,
  getVocabs,
};

