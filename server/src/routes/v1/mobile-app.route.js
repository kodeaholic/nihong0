const express = require('express');
const controller = require('../../controllers/mobile-app.controller');

const router = express.Router();

router.route('/maintenance').get(controller.getMaintenanceMode);

module.exports = router;
