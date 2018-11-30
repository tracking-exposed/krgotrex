#!/usr/bin/env node
var _ = require('lodash');
var nconf = require('nconf');
var debug = require('debug')('fetch-wiki');
var jsdom = require('jsdom');
var Promises = require('bluebird');
var request = Promises.promisifyAll(require('request'));
var fs = Promises.promisifyAll(require('fs'));
var { JSDOM } = jsdom;

nconf.file({file: 'config/replacements.json'});

function convertToPUGSection(d) {

    var formatted = `#${d.product}\n\th2 ${d.product}\n\t.intro ${d.intro}\n\t.problem ${d.problem}\n`;

    var solutions = _.map(d.replacements, function(r) {
        return `\n\t.name ${r.name}\n\ta(href="${r.link}") ${r.link}\n\t.desc ${r.desc}\n\t`;
    });

    return formatted + _.join(solutions, '\n');
}

function scrapePage(product, body) {
    var element = new JSDOM(body);
    var intro = element.window.document.getElementsByClassName('intro');
    var problem = element.window.document.getElementsByClassName('problem');
    var entries = element.window.document.getElementsByClassName('entry');
    var sn = 0;

    if(_.size(entries) && _.size(entries) % 3)
        debug("Probably an error? entries %d", _.size(entries));

    if(_.size(entries) )
       sn = _.size(entries) / 3;

    if(!sn)
        return null;

    var issue = {
        product: product,
        intro: intro[0].innerHTML,
        problem: problem[0].innerHTML
    };

    issue.replacements = _.times(sn, function(i) {
        var target = '.solution-' + (i + 1);
        var name = element.window.document.querySelectorAll(target)[0].innerHTML.replace(/.*">/, '').replace(/<.*/, '');
        var link = element.window.document.querySelectorAll(target)[1].innerHTML.replace(/.*href="/, '').replace(/\".*/, '');
        var desc = element.window.document.querySelectorAll(target)[2].innerHTML;
        return { name, link, desc };
    });
    return issue;
}

function processPage(p) {
    return request
        .getAsync(p.url)
        .then(function(response) {
            return scrapePage(p.product, response.body);
        })
        .catch(function(error) {
            debug("Error with %s: %s", p.product, error.message);
        });
};

return Promises
    .map(nconf.get('wikipages'), processPage)
    .then(_.compact)
    .map(function(contents) {

        debug("%s", JSON.stringify(contents, undefined, 2));
        var path ="generated/site/views" + contents.product +'.pug';

        return fs
            .writeFileAsync(path, convertToPUGSection(contents) )
            .tap(function(done) {
                debug("Written file %s", path);
            });
    });
