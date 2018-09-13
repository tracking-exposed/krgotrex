#!/usr/bin/env node
var _ = require('lodash');
var fs = require('fs');
var parser = require('xml2json');
var debug = require('debug')('matrix-creation');

/* The core is here 52.49414, 13.42903 */
//  left, bottom, right, top

// these measuremet are kept as integer, the SQUARE has 
// a distance of 0.002, it means "2" and then divided by 1k
var rootOfEvil = {
    "x": 52494,
    "y": 13429
};

var matrix = [];
var begin = 7;

function caster(input) {

    var ret = input - _.round((begin / 2), 0)
    return ret;
};

_.times(begin, function(x) {
    _.times(begin, function(y) {
        var cx = caster(x + 1);
        var cy = caster(y + 1);
        var distance = ((cx * cy) * 100) + (cx + cy);
        distance = distance < 0 ? -1 * distance : distance;

        var block = {
            distance: distance,
            square: [ cx, cy ],
            left: (rootOfEvil.y + (2 * cy) - 1) / 1000,
            bottom: (rootOfEvil.x + (2 * cx) - 1) / 1000,
            right: (rootOfEvil.y + (2 * cy) + 1) / 1000,
            top: (rootOfEvil.x + (2 * cx) + 1) / 1000 
        };
        matrix.push(block);
    });
});

var sequence = _.map(_.orderBy(matrix, 'distance'), function(entry, i) {
    entry.day = i +1;
    return entry;
});


console.log(JSON.stringify(_.orderBy(matrix, 'distance'), undefined, 2));
