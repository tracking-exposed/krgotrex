const https = require('https');

// Models
const Site = require('../../models/site');
const ExposureResult = require('../../models/exposureResult');

const analyzedSitesUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/sites/krgotrex';
const exposureResultsUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/results/krgotrex';

let services = {};

/**
 * Retrieve list of analyzed websites
 * 
 * @returns {Promise} Promise of Site array
 */
services.getAnalyzedSites = new Promise((resolve, reject) => {
  https.get(analyzedSitesUrl, (response) => {
    let sites = [];
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
      const sitesJson = JSON.parse(body);
      sitesJson.forEach(site => {
        const s = new Site(site);
        sites.push(site);
      });

      resolve(sites);
    });
  }).on('error', (e) => {
    console.error(e);
    reject();
  });
});

/**
 * Retrieve list of exposed tracking results
 * 
 * @returns {Promise} Promise of ExposureResults array
 */
services.getExposureResults = new Promise((resolve, reject) => {
  https.get(exposureResultsUrl, (response) => {
    let results = [];
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
      const resultsJson = JSON.parse(body);
      resultsJson.forEach(result => {
        const s = new ExposureResult(result);
        results.push(result);
      });

      resolve(results);
    });
  }).on('error', (e) => {
    console.error(e);
    reject();
  });
});

module.exports = services;
