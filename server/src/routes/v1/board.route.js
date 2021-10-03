const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const boardValidation = require('../../validations/board.validation');
const boardController = require('../../controllers/board.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageBoards'), validate(boardValidation.createBoard), boardController.createBoard)
  .get(validate(boardValidation.getBoards), boardController.getBoards);

router
  .route('/:boardId')
  .get(validate(boardValidation.getBoard), boardController.getBoard)
  .patch(auth('manageBoards'), validate(boardValidation.updateBoard), boardController.updateBoard)
  .delete(auth('manageBoards'), validate(boardValidation.deleteBoard), boardController.deleteBoard);

router
  .route('/checkTagsForCards')
  .post(auth('getBoards'), validate(boardValidation.checkTagsForCards), boardController.checkTagsForCards);
module.exports = router;