const express = require('express');
const auth = require('../../middlewares/auth');
const checkController = require('../../controllers/check.controller');
const router = express.Router();

router
  .route('/')
  .get(auth('checkAuth'), checkController.isAuth);

module.exports = router;