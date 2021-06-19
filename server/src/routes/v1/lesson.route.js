const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const lessonValidation = require('../../validations/lesson.validation');
const lessonController = require('../../controllers/lesson.controller');

const router = express.Router();

router
    .route('/')
    .get(auth('admin'), validate(lessonValidation.getLessons), lessonController.getLessons)
    .post(auth('admin'), validate(lessonValidation.createLesson), lessonController.createLesson)
router
    .route('/:lessonId')
    .get(auth('getLessons'), validate(lessonValidation.getLesson), lessonController.getLesson)
    .patch(auth('admin'), validate(lessonValidation.updateLesson), lessonController.updateLesson)
    .delete(auth('admin'), validate(lessonValidation.deleteLesson), lessonController.deleteLesson);

module.exports = router;