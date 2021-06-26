const httpStatus = require('http-status');
const { ListeningBoard } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a board
 * @param {Object} boardBody
 * @returns {Promise<Board>}
 */
const createBoard = async (boardBody) => {
  if (await ListeningBoard.isTitleTaken(boardBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tiêu đề đã tồn tại');
  }
  const board = await ListeningBoard.create(boardBody);
  return board;
};

/**
 * Query for boards
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBoards = async (filter, options) => {
  const boards = await ListeningBoard.paginate(filter, options);
  return boards;
};

/**
 * Get board by id
 * @param {ObjectId} id
 * @returns {Promise<Board>}
 */
const getBoardById = async (id) => {
  return ListeningBoard.findById(id).populate('cards');
};

/**
 * Update board by id
 * @param {ObjectId} boardId
 * @param {Object} updateBody
 * @returns {Promise<Board>}
 */
const updateBoardById = async (boardId, updateBody) => {
  const board = await getBoardById(boardId);
  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
  }
  if (updateBody.title && (await ListeningBoard.isTitleTaken(updateBody.title, boardId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tiêu đề đã tồn tại');
  }
  Object.assign(board, updateBody);
  await board.save();
  return board;
};

/**
 * Delete board by id
 * @param {ObjectId} boardId
 * @returns {Promise<Board>}
 */
const deleteBoardById = async (boardId) => {
  const board = await getBoardById(boardId);
  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
  }
  await board.remove();
  return board;
};

module.exports = {
  createBoard,
  queryBoards,
  getBoardById,
  updateBoardById,
  deleteBoardById,
};
