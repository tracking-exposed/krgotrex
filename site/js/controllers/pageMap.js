const dataService = require('../services/data.service');

exports.module = async function(language) {

  const sites = await dataService.getAnalyzedSites;
  const results = await dataService.getExposureResults;

  res.render('page', {
    sites,
    results,
    i18n: language
  });

};
