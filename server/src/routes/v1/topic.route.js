const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const topicValidation = require('../../validations/topic.validation');
const topicController = require('../../controllers/topic.controller');

const router = express.Router();

router
    .route('/')
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
module.exports = router;