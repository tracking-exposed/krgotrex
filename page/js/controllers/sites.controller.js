const sitesService = require('../services/analyzed-sites.service');
const siteNames = require('../../assets/data/vars');
const Site = require('../../models/site');

exports.homePage = async (req, res, next) => {
  const sitesJson = await sitesService.getAnalyzedSites;
  let sites = [];
  sitesJson.forEach(site => {
    const s = new Site (
      site['address'],
      site['campaign'],
      site['frequency'],
      site['href'],
      site['id'],
      site['iteration'],
      site['kind'],
      site['name'],
      site['lastSurfId'],
      site['lastChecked'],
      site['lastResultId'],
      site['lastCheckTime'],
      site['latitude'],
      site['longitude']
    );
    sites.push(site);
  });
  res.render('page', {
    sites,
    siteName: siteNames.analyzedSites
  })
};

// exports.analyzedSites = async (req, res) => {
//   const sites = await sitesService.getAnalyzedSites;
//   res.render('map', {
//     sites,
//     siteName: siteNames.analyzedSites
//   });
// };
