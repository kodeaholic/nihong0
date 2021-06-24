const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const vocabValidation = require('../../validations/vocab.validation');
const vocabController = require('../../controllers/vocab.controller');

const router = express.Router();

router
    .route('/')
    .get(auth('getVocabs'), validate(vocabValidation.getVocabs), vocabController.getVocabs)
    .post(auth('admin'), validate(vocabValidation.createVocab), vocabController.createVocab)
router
    .route('/:vocabId')
    .get(auth('getVocabs'), validate(vocabValidation.getVocab), vocabController.getVocab)
    .patch(auth('admin'), validate(vocabValidation.updateVocab), vocabController.updateVocab)
    .delete(auth('admin'), validate(vocabValidation.deleteVocab), vocabController.deleteVocab);

module.exports = router;