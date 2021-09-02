const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/news.validation');
const controller = require('../../controllers/news.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageNews'), validate(validation.createItem), controller.createItem)
  .get(auth('getNews'), validate(validation.getItems), controller.getItems);
router
  .route('/:itemId')
  .get(auth('getNews'), validate(validation.getItem), controller.getItem)
  .patch(auth('manageNews'), validate(validation.updateItem), controller.updateItem)
  .delete(auth('manageNews'), validate(validation.deleteItem), controller.deleteItem);

module.exports = router;
