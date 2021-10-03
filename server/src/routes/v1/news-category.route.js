const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/news-category.validation');
const controller = require('../../controllers/news-category.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageNewsCategory'), validate(validation.createItem), controller.createItem)
  .get(validate(validation.getItems), controller.getItems);
router
  .route('/:itemId')
  .get(validate(validation.getItem), controller.getItem)
  .patch(auth('manageNewsCategory'), validate(validation.updateItem), controller.updateItem)
  .delete(auth('manageNewsCategory'), validate(validation.deleteItem), controller.deleteItem);

module.exports = router;
