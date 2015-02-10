var request = require('request'),
    cheerio = require('cheerio'),
    Youtube = require("youtube-api");

var API_KEY = 'AIzaSyDJBBhYv82yCapkRximfLeereozfJTXJ20';

/**
 *  @params {number} year 取得したい年
 *  @return {Promise} プロミスオブジェクト。成功すればアニメのタイトルの配列を返す。
 *
 *  @example anime.getListByYear(2014);
 */
module.exports.getList = function(year) {
    return new Promise(function(resolve, reject) {
            var url = 'http://ja.wikipedia.org/wiki/Category:' + encodeURIComponent(year + '年のテレビアニメ');
            request.get(url, function(err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        })
        .then(function(html) {
            var $ = cheerio.load(html),
                titles = [];

            $('#mw-pages .mw-content-ltr a')
                .map(function(i, el) {
                    el = $(el)
                    if (el.text() === el.attr('title')) {
                        titles.push(el.text());
                    }
                });

            return titles;
        });
};

module.exports.searchYoutube = function(query) {
    // Add a Video to a playlist
    return new Promise(function(resolve, reject) {
        request.get({
                url: 'https://www.googleapis.com/youtube/v3/search' +
                    '?part=id' +
                    '&q=' + encodeURIComponent(query) +
                    '&key=' + API_KEY,
                headers: {
                    Referer: 'localhost:3000'
                }
            },
            function(err, res, body) {
                if (err) {
                    return reject(err);
                }

                resolve(JSON.parse(body));
            });
    });
};
