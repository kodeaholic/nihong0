const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/subTest.validation');
const controller = require('../../controllers/subTest.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTest'), validate(validation.createItem), controller.createItem)
  .get(auth('test'), validate(validation.getItems), controller.getItems);
router
  .route('/findByQuestion')
  .post(auth('manageTest'), validate(validation.findTestByQuestion), controller.findTestByQuestion)
router
  .route('/queryItemsByQuestion')
  .post(auth('manageTest'), validate(validation.queryItemsByQuestion), controller.queryItemsByQuestion)
router
  .route('/:itemId')
  .get(validate(validation.getItem), controller.getItem)
  .patch(auth('manageTest'), validate(validation.updateItem), controller.updateItem)
  .delete(auth('manageTest'), validate(validation.deleteItem), controller.deleteItem);

module.exports = router;