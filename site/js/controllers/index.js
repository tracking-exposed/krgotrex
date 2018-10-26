const dataService = require('../services/data.service');

const renderLocalizedPage = async (res, i18n, language, page, option) => {

  const sites = await dataService.getAnalyzedSites;
  const results = await dataService.getExposureResults;

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
