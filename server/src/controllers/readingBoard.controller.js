const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { readingBoardService } = require('../services');

const createBoard = catchAsync(async (req, res) => {
  const board = await readingBoardService.createBoard(req.body);
  res.status(httpStatus.CREATED).send(board);
});

const getBoards = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'level']);
  if (filter.title) filter.title = new RegExp(filter.title) // this will add {title: /title/i} to filter to search by regex, not search by identical string comparison
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await readingBoardService.queryBoards(filter, options);
  res.send(result);
});

const getBoard = catchAsync(async (req, res) => {
  const board = await readingBoardService.getBoardById(req.params.boardId);
  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
  }
  res.send(board);
});

const updateBoard = catchAsync(async (req, res) => {
  const board = await readingBoardService.updateBoardById(req.params.boardId, req.body);
  res.send(board);
});

const deleteBoard = catchAsync(async (req, res) => {
  await readingBoardService.deleteBoardById(req.params.boardId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
