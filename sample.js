#!/usr/bin/env nodejs
var _ = require('lodash');
var fs = require('fs');
var parser = require('xml2json');


var content = fs.readFileSync("x.osm", 'utf8')
var sa = JSON.parse(parser.toJson(content));
var nodes = sa["osm"]["node"];


tags = _.reduce(nodes, function(memo, n) { if(n.tag) memo.push(n.tag); return memo; }, []);

debugger;


var webs = _.reduce(tags, function(memo, t) {

    if(_.size(t) < 3)
        return memo;

debugger;
    var web = false;
    _.each(t, function(o) {
debugger;
        if(_.startsWith(o.v, 'http')) {
            console.log(o.k);
            web = true;
        }
    });

debugger;
    if(web)
        memo.push(t);

debugger;
    return memo;

}, []);


// 20218  wget -o kreuzberg-partial.osm "https://api.openstreetmap.org/api/0.6/map?bbox=13.37,52.48,13.40,52.49"
//
// console.log(JSON.stringify(webs, undefined, 2));
