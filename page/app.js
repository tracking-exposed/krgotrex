const express = require('express');
const path = require('path');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

// Routes
const routes = require('./routes/index');

const app = express();

// App wide variables
app.locals.title = 'Kreuzberg Google Tracking Exposed';
app.locals.shortTitle = 'KrGoTrEx';

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our html files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, '/styles'),
  dest: path.join(__dirname),
  indentedSyntax: false, // true = .sass and false = .scss,
  outputStyle: 'compressed',
  sourceMap: true
}));
app.use(express.static(path.join(__dirname)));

app.use('/', routes);

module.exports = app;
