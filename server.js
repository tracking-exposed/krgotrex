const connect = require('connect');
const sassMiddleware = require('node-sass-middleware');
const postcssMiddleware = require('postcss-middleware');
const autoprefixer = require('autoprefixer');
const path = require('path');

const srcPath = __dirname + '/page/styles';
const destPath = __dirname + '/page';

const serveStatic = require('serve-static')
const http = require('http');
const port = process.env.PORT || 8000;
const app = connect();

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
console.log(`Server is running. Go to http://localhost:${port}`);
console.log('srcPath is ' + srcPath);
console.log('destPath is ' + destPath);
