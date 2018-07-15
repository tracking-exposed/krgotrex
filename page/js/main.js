"use strict";

$(function() {
  console.log('init https://kreuzberg.google.tracking.exposed/api/v1/sites/krgotrex');


  // URL updates and the element focus is maintained
  // originally found via in Update 3 on http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links

  // filter handling for a /dir/ OR /indexordefault.page
  function filterPath(string) {
    return string
      .replace(/^\//, '')
      .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
      .replace(/\/$/, '');
  }

  var locationPath = filterPath(location.pathname);

  /**
   * Famous Smooth Scrolling snippet from
   * https://css-tricks.com/smooth-scrolling-accessibility/
   * 
   * Automagically scrolls smoothly to the designated section
   * when clicking on a link that jump marks an element's `#id`
   */
  $('a[href*="#"]').each(function () {
    var thisPath = filterPath(this.pathname) || locationPath;
    var hash = this.hash;
    if ($("#" + hash.replace(/#/, '')).length) {
      if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
        var $target = $(hash), target = this.hash;
        if (target) {
          $(this).click(function (event) {
            console.log(event);
            event.preventDefault();
            $('html, body').animate({scrollTop: $target.offset().top}, 1000, function () {
              location.hash = target; 
              $target.focus();
              if ($target.is(":focus")){ //checking if the target was focused
                return false;
              }else{
                $target.attr('tabindex','-1'); //Adding tabindex for elements not focusable
                $target.focus(); //Setting focus
              };
            });       
          });
        }
      }
    }
  });

});

/**
 * Leaflet Map
 */
// const mymap = L.map('leaflet-map').setView([51.505, -0.09], 13);
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//   maxZoom: 18,
//   style: 'mapbox://styles/mapbox/dark-v9',
//   id: 'mapbox.streets',
//   accessToken: 'pk.eyJ1IjoiZ3Jvc2NoZW5yb21hbiIsImEiOiJjampuYjZvMDUxOHRpM3FvMWZ6cTRreGVjIn0.EpyQov5DhmqQmrskmic2uQ'
// }).addTo(mymap);

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Jvc2NoZW5yb21hbiIsImEiOiJjampuYjZvMDUxOHRpM3FvMWZ6cTRreGVjIn0.EpyQov5DhmqQmrskmic2uQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 13,
    center: [4.899, 52.372],
    scrollZoom: false
});
