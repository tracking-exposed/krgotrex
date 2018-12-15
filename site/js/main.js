"use strict";

// Providers
const singleCachedSiteUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/site/',
      singleCheckSiteUrl = 'https://kreuzberg.google.tracking.exposed/api/v1/monosite/';

// vars
let listContainer = document.getElementById('sites-results-list'),
    siteToCheck = '',
    listItemSelected = null;
const htmlListElements = listContainer
      ? listContainer.getElementsByClassName('site-results-item')
      : [],
      $searchField = $('#search-sites-input'),
      // Responsive helpers
      breakPointSmall = 0,
      breakPointMedium = 640,
      breakpointLarge = 1024,
      vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

$searchField.val(''); // Empty search field initally

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
 * C H E C K   Y O U R   S I T E
 ********************************/

// helper fn
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

/***********************************************
 *                                             *
 *          F I L T E R   S I T E S            *
 *                                             *
 **********************************************/

/**
 * Filters site results
 * @param {event} event Keyboard key being released
 */
$searchField.on('keyup', (event) => {
// When user clicks in input field to filter sites
// let's reset the view
  resetMapSitesView();

  const inputVal = event.target.value.trim(),
        regex = new RegExp(inputVal, 'gi');

  for (let i = 0; i < htmlListElements.length; i++) {
    const elem = htmlListElements[i],
          siteNameOrAddress = elem.children[0].children[1].children[0];
    if (siteNameOrAddress.innerText.search(regex) === -1) {
      hideElement(elem);
    } else {
      clearViewClasses(elem);
    }
  }
});

/**
 *  H E L P E R S
 *****************/
function hideElement(elem) {
  if (!elem) return;
  elem.classList.add('scale-down');
  elem.ontransitionend = (event) => {
    if (elem.classList.contains('scale-down')) {
      elem.classList.add('hidden');
    }
  }
}

function selectElement(elem, focusElem = true) {
  if (!elem || elem.classList.contains('selected')) return;

  // Remove selected class from former selected item
  if (listItemSelected) {
    clearViewClasses(listItemSelected);
  }

  listItemSelected = elem;
  listItemSelected.classList.add('selected');

  if (focusElem) {
    listItemSelected.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

function clearViewClasses(elem) {
  let el;
  if (!elem) {
    if (listItemSelected) {
      el = listItemSelected;
    } else {
      return;
    }
  } else {
    el = elem;
  }
  el.classList.remove('hidden');
  el.classList.remove('scale-down');
  el.classList.remove('selected');
}

function resetMapSitesView() {
  if (select) {
    select.getFeatures().clear();
  }
  clearViewClasses();
}

function centerMapToPin(elem) {
  resetMapSitesView();
  const lat = Number(elem.dataset.latitude),
        lon = Number(elem.dataset.longitude),
        siteId = elem.dataset.site,
        newCenter = ol.proj.fromLonLat([lon, lat]);
  if (view) {
    view.setCenter(newCenter);
    view.setZoom(19);
  }

  const siteItem = document.getElementById(siteId);
  selectElement(siteItem, false);

  if (vpWidth < breakpointLarge) {
    const mapContainer = document.getElementById('map');
    mapContainer.scrollIntoView({
      behavior: 'smooth'
    });
  }
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
   *   M E N U
   ************/
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

