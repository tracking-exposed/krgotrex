const express = require('express'),
      session = require('express-session'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      sassMiddleware = require('node-sass-middleware'),
      path = require('path'),
      i18n = require("i18n"),
      _ = require('lodash');

// Routes
    const controller = require('./js/controllers/index'),
      app = express();

// Internationalisation
//
// Based on this implementation:
// https://markocen.github.io/blog/i18n-for-node-application.html
// with this fix:
// https://github.com/mashpie/i18n-node/issues/238#issuecomment-220769255
const supportedLanguages = ['de', 'en'];
const defaultLocale = 'de';
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

// App wide variables
app.locals.title = 'Kreuzberg Google Tracking Exposed';
app.locals.shortTitle = 'Kr.Go.Tr.Ex';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'assets'),
  debug: true,
  indentedSyntax: false, // true = .sass and false = .scss,
  outputStyle: 'compressed',
  sourceMap: true
}));
console.log( path.join(__dirname, 'styles'));
console.log(path.join(__dirname, 'assets'));

app.use(express.static(path.join(__dirname)));

app.get('/:lang/:page/:option?', (req, res) => {
    i18n.configure({
      locales: supportedLanguages,
      defaultLocale,
      directory: __dirname + '/locales',
      register: global
    });

    // default: using 'accept-language' header to guess language settings
    app.use(i18n.init);

    if (supportedLanguages.indexOf(req.params.lang) === -1) {
        return controller.renderLocalizedPage(res, i18n, defaultLocale, defaultPage);
    }

    return controller.renderLocalizedPage(res, i18n, req.params.lang, req.params.page, req.params.option);
});

app.get('/', (req, res) => {
   return controller.renderLocalizedPage(res, defaultLocale, defaultPage, null);
});

module.exports = app;
