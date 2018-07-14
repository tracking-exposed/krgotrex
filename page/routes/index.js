const express = require('express');
const router = express.Router();
const sitesController = require('../js/controllers/sites.controller');
const { catchErrors } = require('../js/errorHandler');

/* GET home page. */
router.get('/', catchErrors(sitesController.homePage));

/* GET users listing. */
router.get('/sites', catchErrors(sitesController.getWebsites));

module.exports = router;
