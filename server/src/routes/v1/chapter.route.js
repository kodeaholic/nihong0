const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chapterValidation = require('../../validations/chapter.validation');
const chapterController = require('../../controllers/chapter.controller');

const router = express.Router();

router
    .route('/')
    .get(auth('getChapters'), validate(chapterValidation.getChapters), chapterController.getChapters)
    .post(auth('admin'), validate(chapterValidation.createChapter), chapterController.createChapter)
router
    .route('/:chapterId')
    .get(auth('getChapters'), validate(chapterValidation.getChapter), chapterController.getChapter)
    .patch(auth('admin'), validate(chapterValidation.updateChapter), chapterController.updateChapter)
    .delete(auth('admin'), validate(chapterValidation.deleteChapter), chapterController.deleteChapter);

module.exports = router;