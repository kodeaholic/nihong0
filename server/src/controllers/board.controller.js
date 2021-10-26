const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { boardService } = require('../services');

const createBoard = catchAsync(async (req, res) => {
  const board = await boardService.createBoard(req.body);
  res.status(httpStatus.CREATED).send(board);
});

const getBoards = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'level']);
  if (filter.title) filter.title = new RegExp(filter.title) // this will add {title: /title/i} to filter to search by regex, not search by identical string comparison
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await boardService.queryBoards(filter, options);
  res.send(result);
});

const getBoard = catchAsync(async (req, res) => {
  const board = await boardService.getBoardById(req.params.boardId);
  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
  }
  res.send(board);
});

const getItemBySlug = catchAsync(async (req, res) => {
  const item = await boardService.getItemBySlug(req.params.slug);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài không tồn tại hoặc đã bị xoá');
  }
  res.send(item);
});

const updateBoard = catchAsync(async (req, res) => {
  const board = await boardService.updateBoardById(req.params.boardId, req.body);
  res.send(board);
});

const checkTagsForCards = catchAsync(async (req, res) => {
  const result = await boardService.checkTagsForCards(req.body.letters);
  res.send(result);
});

const deleteBoard = catchAsync(async (req, res) => {
  await boardService.deleteBoardById(req.params.boardId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  getItemBySlug,
  updateBoard,
  deleteBoard,
  checkTagsForCards
};
