"use strict";

$(function() {
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

  function getCookieValue(a) {
      let b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
  }

  function setActiveLinkClass() {
    const locale = getCookieValue('i18n');
    if (locale) {
      $(`#header-link-${locale}`).addClass('active');
    }
  };
  setActiveLinkClass();

});
