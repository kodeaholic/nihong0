const httpStatus = require('http-status');
const { Chapter } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a chapter
 * @param {Object} chapterBody
 * @returns {Promise<Chapter>}
 */
const createChapter = async (chapterBody) => {
  const chapter = await Chapter.create(chapterBody);
  return chapter;
};

/**
 * Query for chapters
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.populate] - Populate associated cards
 * @returns {Promise<QueryResult>}
 */
const queryChapters = async (filter, options) => {
  const chapters = await Chapter.paginate(filter, options);
  return chapters;
};

/**
 * Get chapter by id
 * @param {ObjectId} id
 * @returns {Promise<Chapter>}
 */
const getChapterById = async (id) => {
  return Chapter.findById(id).populate('topic');
};

/**
 * Update chapter by id
 * @param {ObjectId} chapterId
 * @param {Object} updateBody
 * @returns {Promise<Chapter>}
 */
const updateChapterById = async (chapterId, updateBody) => {
  const chapter = await getChapterById(chapterId);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
  }
  Object.assign(chapter, updateBody);
  await chapter.save();
  return chapter;
};

/**
 * Delete chapter by id
 * @param {ObjectId} chapterId
 * @returns {Promise<Chapter>}
 */
const deleteChapterById = async (chapterId) => {
  const chapter = await getChapterById(chapterId);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
  }
  await chapter.remove();
  return chapter;
};

module.exports = {
  createChapter,
  queryChapters,
  getChapterById,
  updateChapterById,
  deleteChapterById,
};
