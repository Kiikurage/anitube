#!/usr/bin/env node

var argv = require('argv'),
    http = require('http'),
    crawler = require('./animecrawler.js');

argv.option({
    name: 'year',
    short: 'y',
    type: 'number',
    description: 'broadcasted year.'
});

argv.option({
    name: 'noTitle',
    short: 'n',
    type: 'boolean',
    description: 'if true, output without title.'
});

argv.option({
    name: 'server',
    short: 's',
    type: 'boolean',
    description: 'if true, open preview webpage.'
});

var args = argv.run();

var YEAR = args.options.year || (new Date()).getFullYear(),
    NOTITLE = args.options.noTitle,
    SERVER = args.options.server;

var output = [],
    flagHead;

crawler
    .getList(YEAR)
    .then(function(titles) {
        return Promise.all(titles.map(function(title) {
                return Promise.all(
                    ['OP', 'ED']
                    .map(function(suffix) {
                        var extendTitle = title + ' ' + suffix;
                        return crawler.searchYoutube(extendTitle + ' full')
                            .then(function(data) {
                                var id = data.items[0] ? data.items[0].id.videoId : null;

                                flagHead = (/ラブライブ.*OP/).test(extendTitle);

                                if (id) {
                                    if (NOTITLE) {
                                        console.log(id);
                                        if (flagHead) {
                                            output.unshift(id);
                                        } else {
                                            output.push(id);
                                        }
                                    } else {
                                        console.log(id + ' ' + extendTitle);
                                        if (flagHead) {
                                            output.unshift(id + ' ' + extendTitle);
                                        } else {
                                            output.push(id + ' ' + extendTitle);
                                        }
                                    }
                                }
                            })
                    }));
            }))
            .then(function() {
                if (SERVER) {
                    var http = require('http'),
                        fs = require('fs'),
                        server = http.createServer();

                    server.listen(1337, '127.0.0.1', function() {
                        var exec = require('child_process').exec;

                        exec('open http://127.0.0.1:1337/', function(err, stdout, stderr) {
                            if (err || stderr) {
                                exec('gnome-open http://127.0.0.1:1337/', function(err, stdout, stderr) {
                                    console.log('please access http://127.0.0.1:1337/');
                                });
                            }
                        });
                    });

                    server.on('request', function(req, res) {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        res.end(
                            fs.readFileSync(__dirname + '/preview.html', 'utf8')
                            .replace('{{output}}', output.join('\n'))
                        );
                        process.exit();
                    });
                }
            })
    })
    .catch(function(err) {
        console.dir(err);
    });
