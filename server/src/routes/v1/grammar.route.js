const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/grammar.validation');
const controller = require('../../controllers/grammar.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageGrammar'), validate(validation.createItem), controller.createItem)
  .get(auth('getGrammar'), validate(validation.getItems), controller.getItems);
router
  .route('/:itemId')
  .get(auth('getGrammar'), validate(validation.getItem), controller.getItem)
  .patch(auth('manageGrammar'), validate(validation.updateItem), controller.updateItem)
  .delete(auth('manageGrammar'), validate(validation.deleteItem), controller.deleteItem);

module.exports = router;