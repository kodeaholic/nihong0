const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/search.validation');
const controller = require('../../controllers/search.controller');

const router = express.Router();

router
    .route('/')
    .post(auth('search'), validate(validation.search), controller.search)

module.exports = router;