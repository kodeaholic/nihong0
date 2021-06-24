const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const topicValidation = require('../../validations/topic.validation');
const topicController = require('../../controllers/topic.controller');

const router = express.Router();

router
    .route('/')
    .get(auth('getTopics'), validate(topicValidation.getTopics), topicController.getTopics)
    .post(auth('admin'), validate(topicValidation.createTopic), topicController.createTopic)

router
    .route('/:topicId')
    .get(auth('getTopics'), validate(topicValidation.getTopic), topicController.getTopic)
    .patch(auth('admin'), validate(topicValidation.updateTopic), topicController.updateTopic)
    .delete(auth('admin'), validate(topicValidation.deleteTopic), topicController.deleteTopic);

module.exports = router;