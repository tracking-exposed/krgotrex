const dataService = require('../services/data.service');

const renderLocalizedPage = async (res, i18n, language, page, option) => {

  const sites = await dataService.getAnalyzedSites;
  const results = await dataService.getExposureResults;

  console.log('i18n: ', i18n, 'language: ', language, 'page: ', page, 'option: ', option);

  debugger;
  i18n.setLocale(language);

  res.render('webapp', {
    sites,
    results,
    i18n,
    page
  });
};

module.exports = {
  renderLocalizedPage
};
