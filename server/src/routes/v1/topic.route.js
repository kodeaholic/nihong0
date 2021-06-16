const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const topicValidation = require('../../validations/topic.validation');
const topicController = require('../../controllers/topic.controller');

const router = express.Router();

router
    .route('/')
    .get(auth('admin'), validate(topicValidation.getTopics), topicController.getTopics)
    .post(auth('manageTopics'), validate(topicValidation.createTopic), topicController.createTopic)

router
    .route('/:topicId')
    .get(auth('getTopics'), validate(topicValidation.getTopic), topicController.getTopic)
    .patch(auth('manageTopics'), validate(topicValidation.updateTopic), topicController.updateTopic)
    .delete(auth('manageTopics'), validate(topicValidation.deleteTopic), topicController.deleteTopic);

router
    .route('/:topicId/chapters')
    .get(auth('getTopics'), validate(topicValidation.getTopic), topicController.getChaptersByTopicId)

router
    .route('/:topicId/chapters/:chapterId')
    .delete(auth('manageTopics'), validate(topicValidation.deleteChapterByTopicIdChapterId), topicController.deleteChapterByTopicIdChapterId)
    .patch(auth('manageTopics'), validate(topicValidation.updateChapterByTopicIdChapterId), topicController.updateChapterByTopicIdChapterId);

router
    .route('/:topicId/chapters')
    .post(auth('manageTopics'), validate(topicValidation.createChapterByTopicId), topicController.createChapterByTopicId);

/** Lesson */
router
    .route('/chapters/:chapterId/lessons')
    .get(auth('admin'), validate(topicValidation.getLessonsByChapterId), topicController.getLessonsByChapterId);
router
    .route('/delete-lesson/:chapterId/:lessonId')
    .delete(auth('admin'), validate(topicValidation.deleteLessonByChapterIdLessonId), topicController.deleteLessonByChapterIdLessonId);
router
    .route('/create-lesson/:chapterId/')
    .post(auth('admin'), validate(topicValidation.createLessonByChapterId), topicController.createLessonByChapterId);
router
    .route('/update-lesson/:chapterId/:lessonId')
    .patch(auth('admin'), validate(topicValidation.updateLessonByChapterIdLessonId), topicController.updateLessonByChapterIdLessonId);

module.exports = router;