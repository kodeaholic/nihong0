const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { chapterService } = require('../services');

const createChapter = catchAsync(async (req, res) => {
  const chapter = await chapterService.createChapter(req.body);
  res.status(httpStatus.CREATED).send(chapter);
});

const getChapters = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  if (filter.name) filter.name = new RegExp(filter.name) // this will add {name: /name/i} to filter to search by regex, not search by identical string comparison
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await chapterService.queryChapters(filter, options);
  res.send(result);
});

const getChapter = catchAsync(async (req, res) => {
  const chapter = await chapterService.getChapterById(req.params.chapterId);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter không tồn tại hoặc đã bị xoá');
  }
  res.send(Chapter);
});

const updateChapter = catchAsync(async (req, res) => {
  const chapter = await chapterService.updateChapterById(req.params.chapterId, req.body);
  res.send(chapter);
});

const deleteChapter = catchAsync(async (req, res) => {
  const chapter = await chapterService.deleteChapterById(req.params.chapterId);
  res.send(chapter);
});

module.exports = {
  createChapter,
  getChapters,
  getChapter,
  updateChapter,
  deleteChapter,
};
