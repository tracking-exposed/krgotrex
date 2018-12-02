"use strict";

// Providers
const singleCachedSiteUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/site/',
      singleCheckSiteUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/monosite/';

let siteToCheck = '';

async function getSingleSite(siteName) {
  if (!siteName) {
    return;
  }
  return await new Promise((resolve, reject) => {
    siteToCheck = siteName;
    $.getJSON(singleCachedSiteUrl + siteName, (response) => {
      if (!response.when) {
        $.getJSON(singleCheckSiteUrl + siteName, (response) => {
          resolve(response);
        });
      } else {
        resolve(response);
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      const reason = `getJSON request failed in getSingleSite()! \nDetails: ${textStatus} \n${errorThrown} \n${JSON.stringify(jqXHR)}`;
      reject(reason);
    });
  });
}

/**
 * C H E C K  Y O U R  S I T E
 */

// helpers
function disableFormCheckSite(disable = true) {
  $('#form-check-site-input').prop("disabled", disable);
  $('#form-check-site-btn').prop("disabled", disable);
}
async function checkSite(event) {
  event.preventDefault();
  event.stopPropagation();
  const inputVal = event.target[1].value;
  // Display loading indicator
  $('#check-site-result').empty();
  $('#check-site-loader').show();
  disableFormCheckSite();
  // Determine language for setting error messages
  const docLocation = document.location.toString(),
    isGermanLang = docLocation.indexOf('/de/') > 0;

  try {
    const regex = new RegExp(/^https?:\/\/|\s/, 'gi'),
      trimmedVal = inputVal.replace(regex, ''); // Remove 'http(s)://' as well as white space
    const response = await getSingleSite(trimmedVal);

    // Convert the Google results into a list
    let result = {};
    function convertObj2Html(obj) {
      let htmlList = "";

      for (let key in obj) {
        if( obj.hasOwnProperty(key) ) {
          htmlList += `<li class="small-8 large-10 column alert">☢️ ${key}: ${obj[key]}</li>`;
        }
      }
      return htmlList;
    }
    if (response.summary) {
      result = {
        page: response.page,
      }

      if (Object.keys(response.summary.googles).length > 0) {
        result = {
          ...result,
          content: `
            <ul class="row site-googles">
              ${convertObj2Html(response.summary.googles)}
            </ul>
          `
        };
      } else {
        result = {
          ...result,
          content: `<b class="success">${
            isGermanLang
            ? 'Sauber! Diese Seite ist frei von Google Trackern.'
            : 'Clean! This site is free from Google trackers.'
          } 🎉</b>`
        }
      }
    } else {
      result = {
        page: inputVal,
        content: `<span class="warning">⚠️ ${
            isGermanLang
            ? 'Ups! Die Suche ging schief. Bitte überprüfe Deine Internetverbindung.'
            : 'Oops! The search failed. Please check your internet connection.'
          }</span>`
      }
    }
    $('#check-site-loader').hide();
    $('#check-site-result').append(`
      <h2>${result.page}</h2>
      ${result.content}
    `);
    disableFormCheckSite(false);
  } catch (error) {
    $('#check-site-loader').hide();
    disableFormCheckSite(false);
    $('#check-site-result').append(`⚠️ ${
      isGermanLang
      ? '<h2>Ups!</h2><br><p>Etwas ist schief gelaufen. Bitte versuch es später erneut.</p>'
      : '<h2>Oops!</h2><br><p>Something went wrong. Please try again later.</p>'
    }`);

    console.error('main.js: Site could not be checked. Reason: ', error);
  }
}

function searchSite(event) {
  if (!event) return;

  event.preventDefault();
  console.log("searching for", event.target.value);
  // const resultSite = sitesArray.search(e.target.value) > -1;
  // console.log(resultSite);
  // return resultSite;
}

$(function() {

  function setActiveLinkClass() {
    if (!window) {
      console.log('No window (yet) in setActiveClass()');
      return;
    }

    let path = window.document.location.pathname;
    const firstUrlPart = path.split('/')[1],
      secondUrlPart = path.split('/')[2];

    /* TODO put the regexp in a variable, or this list might give problem in maintanence */
    let page = (secondUrlPart && secondUrlPart.match(/kreuzberg|campaign|about|replacements|map|check/)) ? secondUrlPart : 'campaign';

    /* in case someone call for /check or /campaign, it is considered but the language would be forced default below */
    if(!secondUrlPart && firstUrlPart)
        page = firstUrlPart.match(/kreuzberg|campaign|about|replacements|map|check/) ? firstUrlPart : 'campaign';
 
    const locale = (firstUrlPart && firstUrlPart.match(/de|en/)) ? firstUrlPart : 'de';

    history.pushState({}, `Kreuzberg Google Tracking Exposed`, `/${locale}/${page}`);
    $('body').ready(() => {
      $('#loader').hide();
      $(getElementToShow(page)).show();
    });


    if (locale) {
      $(`#header-link-${locale}`).addClass('active');
    }
  };
  setActiveLinkClass();

  /**
   *  M E N U
   */
  /* intercept the click event and don't propagate it: we'll toggle the classes instead or reloading */
  $("a[data-route]").on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      $(".component").hide();
      const routeId = $(this).attr('data-route');
      console.log("Managing click to", routeId);
      $(getElementToShow(routeId)).show();

      history.pushState({}, `Welcome to ${routeId}`, routeId);
      // TODO highlight on tab
  });

  function getElementToShow(routeId) {
    if (!routeId) return;
    return `#component-${routeId}`;
  }
});

/********************************************
 * Prepare filter index for instant feedback
 ********************************************/
const documents = [];
for (let site in siteData) {
  const result = resultData.find(r => r.id === site.lastResultId);
  documents.push(result);
}

  documents.forEach((doc) => {
    this.add(doc)
  }, this)

/**
 * Filters site results
 * @param {event} event Keyboard key being released
 */
function filterSites(event) {
  if (!event) return;
  event.preventDefault();
  console.log(event);

  const resultSite = documents.filter((doc) => event.target[0].value);
  console.log(resultSite);
  return resultSite;
}
