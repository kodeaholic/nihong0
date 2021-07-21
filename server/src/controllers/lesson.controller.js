const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lessonService } = require('../services');

const createLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.createLesson(req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

const getLessons = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'chapter']);
  if (filter.name) filter.name = new RegExp(filter.name) // this will add {name: /name/i} to filter to search by regex, not search by identical string comparison
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await lessonService.queryLessons(filter, options);
  res.send(result);
});

const getLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson không tồn tại hoặc đã bị xoá');
  }
  res.send(lesson);
});

const updateLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.updateLessonById(req.params.lessonId, req.body);
  res.send(lesson);
});

const deleteLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.deleteLessonById(req.params.lessonId);
  res.send(lesson);
});

const sortVocab = catchAsync(async (req, res) => {
  const lesson = await lessonService.sortVocab(req.params.lessonId, req.body);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson không tồn tại hoặc đã bị xoá');
  }
  res.send(lesson);
});

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  sortVocab
};
