const Joi = require('joi');
const { objectId } = require('./custom.validation');

const TrackValidation = {
  content: Joi.string().allow(null, ''),
  contentMeaning: Joi.string().allow(null, ''),
  contentFurigana: Joi.string().allow(null, ''),
  start: Joi.string().allow(null, ''),
  stop: Joi.string().allow(null, ''),
  audioSrc: Joi.string().allow(null, ''),
  role: Joi.number().allow(null, 0),
}

const createBoard = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    script: Joi.string().allow(null, ''),
    subtitle: Joi.string().allow(null, ''),
    audioSrc: Joi.string().allow(null, ''),
    level: Joi.string().allow(null, ''),
    free: Joi.number().required(),
    tracks: Joi.array().items(TrackValidation)
  }),
};

const getBoards = {
  query: Joi.object().keys({
    title: Joi.string(),
    level: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  }),
};

const getBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
};

const updateBoard = {
  params: Joi.object().keys({
    boardId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        title: Joi.string().required(),
        script: Joi.string().allow(null, ''),
        subtitle: Joi.string().allow(null, ''),
        audioSrc: Joi.string().allow(null, ''),
        level: Joi.string().allow(null, ''),
        free: Joi.number().required(),
        tracks: Joi.array().items(TrackValidation)
    })
    .min(1),
};

const deleteBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard
};
