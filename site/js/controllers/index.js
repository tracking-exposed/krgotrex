const dataService = require('../services/data.service');
const pug = require('pug');
const path = require('path');

const renderLocalizedPage = async (res, i18n, language, page, option) => {

  const sites = await dataService.getAnalyzedSites;
  const results = await dataService.getExposureResults;

  i18n.setLocale(language);
  const viewPath = path.join(__dirname, '..', '..', 'views', 'webapp.pug');
  debugger;
  const computedWebAppHTML = pug.compileFile(viewPath, { pretty: true, debug: false})({
    sites,
    results,
    i18n,
    page
  });
  res.send(computedWebAppHTML);

};

module.exports = {
  renderLocalizedPage
};
