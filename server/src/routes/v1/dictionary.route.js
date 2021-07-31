const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/dictionary.validation');
const controller = require('../../controllers/dictionary.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('setDictionary'), validate(validation.createItem), controller.createItem)
  .get(auth('dictionary'), validate(validation.getItems), controller.getItems);

router
  .route('/:id')
  .get(auth('dictionary'), validate(validation.getItem), controller.getItem)
  .patch(auth('setDictionary'), validate(validation.updateItem), controller.updateItem)
  .delete(auth('setDictionary'), validate(validation.deleteItem), controller.deleteItem);

module.exports = router;
