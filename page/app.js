const express = require('express');
const path = require('path');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
