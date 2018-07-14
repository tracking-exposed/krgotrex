const express = require('express');
const router = express.Router();

// Handlers/Controllers/...
const sitesController = require('../js/controllers/sites.controller');
const sitesService = require('../js/services/analyzed-sites.service');
const { catchErrors } = require('../js/errorHandler');

/* GET home page. */
router.get('/', catchErrors(sitesController.homePage));

/* GET users listing. */
router.get('/sites', catchErrors(sitesController.analyzedSites));

module.exports = router;
