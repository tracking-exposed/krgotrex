var connect = require('connect');
var sassMiddleware = require('node-sass-middleware');
var postcssMiddleware = require('postcss-middleware');
var autoprefixer = require('autoprefixer');
var path = require('path');

var srcPath = __dirname + '/page/styles';
var destPath = __dirname + '/page';

var serveStatic = require('serve-static')
var http = require('http');
var port = process.env.PORT || 8000;
var app = connect();

app
.use('/', sassMiddleware({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'compressed',
  force: true,
}))
.use('/page', postcssMiddleware({
  plugins: [
    /* Plugins */
    autoprefixer({
      /* Options */
    })
  ],
  src: function(req) {
    return path.join(destPath, req.url);
  }
})).use('/', 
  serveStatic('./page', {})
);

http.createServer(app).listen(port);
console.log('Server listening on port ' + port);
console.log('srcPath is ' + srcPath);
console.log('destPath is ' + destPath);
