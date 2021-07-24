const Joi = require('joi');
const { objectId } = require('./custom.validation');

const QuizValidation = {
  question: Joi.string().required(),
  A: Joi.string().required(),
  B: Joi.string().required(),
  C: Joi.string().required(),
  D: Joi.string().required(),
  question_vn: Joi.string().required(),
  A_vn: Joi.string().required(),
  B_vn: Joi.string().required(),
  C_vn: Joi.string().required(),
  D_vn: Joi.string().required(),
  answer: Joi.string().required(),
}

const createBoard = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    content_vn: Joi.string().allow(null, ''),
    level: Joi.string().allow(null, ''),
    free: Joi.number().required(),
    quiz: Joi.array().items(QuizValidation)
  }),
};

const getBoards = {
  query: Joi.object().keys({
    title: Joi.string(),
    level: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string()
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
      content: Joi.string().allow(null, ''),
      content_vn: Joi.string().allow(null, ''),
      level: Joi.string().allow(null, ''),
      free: Joi.number().required(),
      quiz: Joi.array().items(QuizValidation)
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
  deleteBoard,
};
