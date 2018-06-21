#!/usr/bin/env nodejs
var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');
var request = Promise.promisifyAll(require('request'));
var various = require('../../../lib/various');
var debug = require('debug')('osmfetch');
var nconf = require('nconf');
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));
var parser = require('xml2json');

var cfg = 'config/osmfetch.json';
var baseurl = "https://api.openstreetmap.org/api/0.6/map?bbox=";
var locationmap = "config/fetchmap.json";

nconf.argv().env().file({ file: cfg });

var iteration = _.parseInt(nconf.get('iteration'));
if(!iteration) {
    console.log("variable `iteration` necessary, as --option, in the ENV or in ", cfg);
    return -1;
}

var force = !!nconf.get('force');

debug("Building destination path, %s and %d", nconf.get('dest'), iteration);
var iterapath = path.join(nconf.get('dest'), _.toString(iteration));
var output = path.join(iterapath, 'osm-output.xml');
var selected = path.join(iterapath, 'selected-shops.json');
var csv = path.join(iterapath, 'produces.csv');

debug("checking if destination %s exists", iterapath);
return fs
    .existsAsync(iterapath)
    .tap(function() {
        debug("creating %s", iterapath);
        return fs.mkdirAsync(iterapath);
    })
    .catch(function(error) {
        if(force) {
            debug("%s exists, but 'force' is true: delete %s %s %s", iterapath, output, selected, csv);
            return Promise.all([
                fs.unlinkAsync(output),
                fs.unlinkAsync(selected),
                fs.unlinkAsync(csv)
            ])
            .catch(function() { });
        } else {
            console.log(iterapath, "directory exists, force disable: quitting");
            sys.exit(-1);
        }
    })
    .then(function() {
        debug("Reading locationmap %s", locationmap);
        return various.loadJSONfile(locationmap)
    })
    .then(function(citymap) {

        var ref = _.find(citymap, {iteration: iteration});
        if(!ref) {
            console.log("iteration too big! the config/fetchmap.json is not so big:", iteration);
            return null;
        }

        // https://wiki.openstreetmap.org/wiki/Downloading_data
        var url = baseurl+ [ ref.left, ref.bottom, ref.right, ref.top ].join(",");
        debug("Getting URL: %s", url);
        return request
            .getAsync(url)
            .then(function(response) {

                debug("Saving %d XML from OSM in %s", _.size(response.body), output);
                var juicy = JSON.parse(parser.toJson(response.body));

                return fs
                    .writeFileAsync(output, response.body)
                    .return(juicy);
            })
    })
    .then(function(jsondata) {

        var nodes = jsondata["osm"]["node"];
        debug("Retireved %d nodes", _.size(nodes));

        tags = _.reduce(nodes, function(memo, n) {

            if(n.tag) {

                var cleanobj = _.reduce(n.tag, function(m, t) {
                    _.set(m, t.k, t.v);
                    return m;
                }, {});
                cleanobj.lat = n.lat;
                cleanobj.lon = n.lon;

                memo.push(cleanobj);
            }
            return memo;
        }, []);

        debug("looking in %d notes with tag", _.size(tags));
        return _.reduce(tags, function(memo, t) {

            if(_.get(t, 'obstacle'))
                return memo;

            var web = false;

            _.each(_.values(t), function(entry) {
                if(_.startsWith(entry, 'http')) {
                    web = true;
                }
            });

            if(web) {

                var website = fuzzy('website', t);
                var address = fuzzy('address', t);
                var kind = fuzzy('kind', t);
                var name = fuzzy('name', t);

                if(!website) {
                    debug("Failure!");
                    return memo;
                }

                debug("-> Adding %s | %s | %s | %s", website, name, address, kind);
                memo.push({
                    site: website,
                    address: address,
                    kind: kind,
                    name: name,
                    lat: t.lat,
                    lon: t.lon
                });
            }

            return memo;
        }, []);

    })
    .tap(function(sites) {
        debug("Saving %d sites on %s", _.size(sites), selected);
        return fs
            .writeFileAsync(selected, JSON.stringify(sites, undefined, 2))
    })
    .catch(function(error) {
        debugger;
    });


function fuzzy(what, obj) {

    var fmap = {
        /* the order is considered a priority */
        website: [ "website", "contact:website" ],
        address: [ "address", "addr:street" ],
        kind: [ "office", "shop", "amenity", "description" ],
        name: [ "name", "description", "amenity" ]
    }

    var refkeywords = fmap[what];

    var found = null; 
    _.each(_.reverse(refkeywords), function(keyw) {
        var d = _.get(obj, keyw);
        if(d)
            found = d;
    });
    return found;
};
