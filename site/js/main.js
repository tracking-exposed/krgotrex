"use strict";

// Providers
const singleCachedSiteUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/site/',
      singleCheckSiteUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/monosite/';

function getSingleSite(siteName) {
  return new Promise((resolve, reject) => {
    if (!siteName) reject();
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
async function checkSite(event) {
  event.preventDefault();
  event.stopPropagation();
  const inputVal = event.target[1].value;
  // Display loading indicator
  $('#check-site-loader').show();
  try {
    const regex = new RegExp(/^https?:\/\/|\s/, 'gi');
    const trimmedVal = inputVal.replace(regex, ''); // Remove 'http(s)://' as well as white space
    const site = await getSingleSite(trimmedVal);
    $('#check-site-result').append(`<pre>${JSON.stringify(site, undefined, 2)}</pre>`);
    $('#check-site-loader').hide();
  } catch (error) {
    $('#check-site-loader').hide();
    console.error('main.js: Site could not be checked. Reason: ', error);
  }
}


function searchSite(event) {
  if (!event) return;

  event.preventDefault();
  console.log(event);
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

    const locale = firstUrlPart && firstUrlPart.match(/de|en/) ? firstUrlPart : 'de';
    const page = secondUrlPart && secondUrlPart.match(/about|replacement|map|check/) ? secondUrlPart : 'about';
    history.pushState({}, `Welcome to Kreuzberg Google Tracking Exposed`, `/${locale}/${page}`);
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
      console.log("yayu");
      const routeId = $(this).attr('data-route');
      $(getElementToShow(routeId)).show();

      history.pushState({}, `Welcome to ${routeId}`, routeId);
      // TODO highlight on tab
  });

  function getElementToShow(routeId) {
    if (!routeId) return;
    return `#component-${routeId}`;
  }

});
