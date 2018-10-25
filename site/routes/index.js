const express = require('express');
const router = express.Router();

// Handlers/Controllers/...
const sitesController = require('../js/controllers/sites.controller');
const { catchErrors } = require('../js/errorHandler');

/* GET home page. */
router.get('/', catchErrors(sitesController.homePage));

module.exports = router;
