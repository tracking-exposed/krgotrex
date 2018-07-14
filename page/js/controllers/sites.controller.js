const https = require('https');
const siteNames = require('../../assets/data/vars');

const analyzedSitesUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/sites/krgotrex';

exports.homePage = (req, res, next) => res.render('index');

exports.getWebsites = async (req, res) => {
  https.get(analyzedSitesUrl, (response) => {
    // Get the data as utf8 strings.
    // If an encoding is not set, Buffer objects will be received.
    response.setEncoding('utf8');

    // Readable streams emit 'data' events once a listener is added
    return response.on('data', (chunk) => {
      // Ensure we get a stringified JSON
      let body = '';
      body += chunk instanceof Buffer
            ? chunk.toJSON()
            : JSON.stringify(eval(`(${chunk})`));

      // Convert json Object into an iterable array
      const sites = JSON.parse(body);

      res.render('sites', {
        sites,
        siteName: siteNames.analyzedSites
      });
    });
  }).on('error', (e) => {
      console.error(e);
  });
};

