const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const boardValidation = require('../../validations/readingBoard.validation');
const boardController = require('../../controllers/readingBoard.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageBoards'), validate(boardValidation.createBoard), boardController.createBoard)
  .get(auth('getBoards'), validate(boardValidation.getBoards), boardController.getBoards);

router
  .route('/:boardId')
  .get(validate(boardValidation.getBoard), boardController.getBoard)
  .patch(auth('manageBoards'), validate(boardValidation.updateBoard), boardController.updateBoard)
  .delete(auth('manageBoards'), validate(boardValidation.deleteBoard), boardController.deleteBoard);

module.exports = router;