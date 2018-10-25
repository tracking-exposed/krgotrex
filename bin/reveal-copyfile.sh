D="web-accessible"
cp -r node_modules/reveal.js/lib $D
cp -r node_modules/reveal.js/js $D
cp -r node_modules/reveal.js/css $D
cp -r node_modules/reveal.js/plugin $D

echo "four directory copyed"
ls -l $D/lib
ls -l $D/js
ls -l $D/css
ls -l $D/plugin
