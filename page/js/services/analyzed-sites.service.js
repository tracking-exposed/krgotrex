const https = require('https');
const analyzedSitesUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/sites/krgotrex';

let services = {};

/**
 * Retrieve list of analyzed websites
 * 
 * @returns {Promise} Promise of JSON object with sites list
 */
services.getAnalyzedSites = new Promise((resolve, reject) => {
  https.get(analyzedSitesUrl, (response) => {
    let sites = {};
    // Get the data as utf8 strings.
    // If an encoding is not set, Buffer objects will be received.
    response.setEncoding('utf8');

    // Readable streams emit 'data' events once a listener is added
    response.on('data', (chunk) => {
      let body = '';
      // Ensure we get a stringified JSON
      body += chunk instanceof Buffer
            ? chunk.toJSON()
            : JSON.stringify(eval(`(${chunk})`));

      // Convert json Object into an iterable array
      sites = JSON.parse(body);
      resolve(sites);
    });
  }).on('error', (e) => {
    console.error(e);
    reject();
  });
});

module.exports = services;
