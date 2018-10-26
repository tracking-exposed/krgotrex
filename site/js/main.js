"use strict";

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

