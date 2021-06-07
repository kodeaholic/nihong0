const express = require('express');
const svgController = require('../../controllers/svg.controller')

const router = express.Router();

router
  .route('/:svgCode')
  .get(svgController.getSvg)

module.exports = router;