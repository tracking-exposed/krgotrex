const express = require('express'),
      session = require('express-session'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      sassMiddleware = require('node-sass-middleware'),
      path = require('path'),
      i18n = require("i18n"),
      _ = require('lodash');

// Routes
    const sitesController = require('./js/controllers/sites.controllers.js'),
      app = express();

// Internationalisation
//
// Based on this implementation:
// https://markocen.github.io/blog/i18n-for-node-application.html
// with this fix:
// https://github.com/mashpie/i18n-node/issues/238#issuecomment-220769255
const supportedLanguages = ['de', 'en'];
const defaultLocale = 'de';
i18n.configure({
  locales: supportedLanguages,
  defaultLocale,
  directory: __dirname + '/locales',
  // sets a custom cookie name to parse locale settings from
  cookie: 'i18n'
});
const defaultPage = 'map';

app.use(cookieParser("i18n_locale"));
app.use(
  session({
    secret: "i18n_locale",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

// default: using 'accept-language' header to guess language settings
app.use(i18n.init);

// App wide variables
app.locals.title = 'Kreuzberg Google Tracking Exposed';
app.locals.shortTitle = 'Kr.Go.Tr.Ex';
// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our html files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, '/styles'),
  dest: path.join(__dirname),
  debug: true,
  indentedSyntax: false, // true = .sass and false = .scss,
  outputStyle: 'compressed',
  sourceMap: true
}));

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
   return sitesController[defaultPage](defaultLocale);
});

app.get('/:lang/:page/:option?', (req, res) => {
  
    if(supportedLanguages.indexOf(req.params.lang) === -1) {
        return sitesController['error']('de');
    }

    const func = _.get(sitesController, req.params.page);

    if(_.isUndefined(func)) {
        return sitesController['error'](req.params.lang);
    } else {
        return func(req.params.lang, req.params.option);
    }

});


module.exports = app;
