const dataService = require('../services/data.service');

exports.homePage = async (req, res, next) => {
  const sites = await dataService.getAnalyzedSites;
  const results = await dataService.getExposureResults;

  res.render('page', {
    sites,
    results
  })
};

// exports.analyzedSites = async (req, res) => {
//   const sites = await dataService.getAnalyzedSites;
//   res.render('map', {
//     sites,
//     siteName: siteNames.analyzedSites
//   });
// };
