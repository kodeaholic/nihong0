const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { topicService } = require('../services');

const createTopic = catchAsync(async (req, res) => {
    const topic = await topicService.createTopic(req.body);
    res.status(httpStatus.CREATED).send(topic);
});

const updateTopic = catchAsync(async (req, res) => {
    const topic = await topicService.updateTopicById(req.params.topicId, req.body);
    res.send(topic);
});

const getTopic = catchAsync(async (req, res) => {
    const topic = await topicService.getTopicById(req.params.topicId);
    if (!topic) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chủ đề không tồn tại hoặc đã bị xoá');
    }
    res.send(topic);
});
const deleteTopic = catchAsync(async (req, res) => {
    await topicService.deleteTopicById(req.params.topicId);
    res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Chapter
 */
const getChaptersByTopicId = catchAsync(async (req, res) => {
    const chapters = await topicService.getChaptersByTopicId(req.params.topicId);
    res.send(chapters)
});

const deleteChapterByTopicIdChapterId = catchAsync(async (req, res) => {
    const chapter = await topicService.deleteChapterByTopicIdChapterId(req.params.topicId, req.params.chapterId);
    res.send(chapter)
})

const createChapterByTopicId = catchAsync(async (req, res) => {
    const chapter = await topicService.createChapterByTopicId(req.params.topicId, req.body);
    res.send(chapter)
})

const updateChapterByTopicIdChapterId = catchAsync(async (req, res) => {
    const chapter = await topicService.updateChapterByTopicIdChapterId(req.params.topicId, req.params.chapterId, req.body);
    res.send(chapter)
})

const deleteLessonByChapterIdLessonId = catchAsync(async (req, res) => {
    const resultTopic = await topicService.deleteLessonByChapterIdLessonId(req.params.chapterId, req.params.lessonId);
    res.send(resultTopic)
})

const createLessonByChapterId = catchAsync(async (req, res) => {
    const updatedChapter = await topicService.createLessonByChapterId(req.params.chapterId, req.body);
    res.send(updatedChapter)
})

const updateLessonByChapterIdLessonId = catchAsync(async (req, res) => {
    const chapter = await topicService.updateLessonByChapterIdLessonId(req.params.chapterId, req.params.lessonId, req.body);
    res.send(chapter)
})

const getLessonsByChapterId = catchAsync(async (req, res) => {
    const chapter = await topicService.getLessonsByChapterId(req.params.chapterId);
    res.send(chapter)
})

module.exports = {
  createTopic,
  updateTopic,
  getTopic,
  deleteTopic,
  getChaptersByTopicId,
  deleteChapterByTopicIdChapterId,
  createChapterByTopicId,
  updateChapterByTopicIdChapterId,
  deleteLessonByChapterIdLessonId,
  createLessonByChapterId,
  updateLessonByChapterIdLessonId,
  getLessonsByChapterId
};
