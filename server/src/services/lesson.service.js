const httpStatus = require('http-status');
const { Lesson, Vocab } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a lesson
 * @param {Object} lessonBody
 * @returns {Promise<Lesson>}
 */
const createLesson = async (lessonBody) => {
  const lesson = await Lesson.create(lessonBody);
  return lesson;
};

/**
 * Query for lessons
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.populate] - Populate associated cards
 * @returns {Promise<QueryResult>}
 */
const queryLessons = async (filter, options) => {
  const lessons = await Lesson.paginate(filter, options);
  const results = lessons["results"]
  let vocabs = []
  if (results) {
      // query for vocabs
      let lessonIDs = results.map(item => item._id)
      vocabs = await Vocab.find({'lesson': { $in: lessonIDs }})
  }
  // transform data
  lessons["vocabs"] = vocabs
  return lessons;
};

/**
 * Get lesson by id
 * @param {ObjectId} id
 * @returns {Promise<Lesson>}
 */

const getLessonById = async (id) => {
  const lesson = await Lesson.findById(id).populate({path: 'chapter', populate: {
    path: 'topic'
  }});
  let vocabs = []
  if (lesson) {
      // get lessons
      vocabs = await Vocab.find({"lesson": id}, null, {sort: { createdAt : 'asc' }}, function(err, docs) {});
      const { name, description, meaning, topic, chapter, audioSrc } = lesson
      return { name, description, meaning, topic, chapter, vocabs, audioSrc }
  }
  return lesson
};
/**
 * Update lesson by id
 * @param {ObjectId} lessonId
 * @param {Object} updateBody
 * @returns {Promise<Lesson>}
 */
const updateLessonById = async (lessonId, updateBody) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
  }
  Object.assign(lesson, updateBody);
  await lesson.save();
  return lesson;
};

/**
 * Delete lesson by id
 * @param {ObjectId} lessonId
 * @returns {Promise<Lesson>}
 */
const deleteLessonById = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài học không tồn tại hoặc đã bị xoá');
  }
  await lesson.remove();
  return lesson;
};

module.exports = {
  createLesson,
  queryLessons,
  getLessonById,
  updateLessonById,
  deleteLessonById,
};
