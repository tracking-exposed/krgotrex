const sitesService = require('../services/analyzed-sites.service');
const siteNames = require('../../assets/data/vars');

exports.homePage = (req, res, next) => res.render('index');

exports.analyzedSites = async (req, res) => {
  const sites = await sitesService.getAnalyzedSites;
  res.render('sites', {
    sites,
    siteName: siteNames.analyzedSites
  });
};

