'use strict';

var path = process.cwd();
var URL = require(path + '/app/models/URL.js');

function URLService () {

    var chars = [];

    (function () {
        var i;
        for (i = 97; i < 123; i++) {
            chars.push(String.fromCharCode(i));
        }

        for (i = 65; i < 91; i++) {
            chars.push(String.fromCharCode(i));
        }

        for (i = 48; i < 58; i++) {
            chars.push(String.fromCharCode(i));
        }

    })();

    this.shortenURL = function (req, res) {
        var originalUrl = req.url.slice(5);

        if (!isValidUrl(originalUrl)) {
            return res.json({error: originalUrl + ' is not a valid URL'});
        }

        var nowTimeStamp = Date.now() + originalUrl.charCodeAt(originalUrl.length - 1) + originalUrl.charCodeAt(originalUrl.length - 2);
        var digits = [];
        var remainder = 0;
        var shortened = '';
        var calculatedId = '';


        while (nowTimeStamp > 0) {
            remainder = nowTimeStamp % chars.length;
            digits.push(remainder);
            nowTimeStamp = Math.round(nowTimeStamp / chars.length);
        }


        for (var i = digits.length - 1; i >= 0; i--) {
            shortened += chars[digits[i]];
            calculatedId += digits[i];
        }
        calculatedId = Number(calculatedId);

        var url = new URL({
            id: calculatedId,
            shortened: shortened,
            full: originalUrl
        });
        url.save(function (err, url) {
            if (err) {
                return res.json(500, {
                    message: 'Error',
                    error: err
                });
            }
            return res.json({original_url: originalUrl, short_url: process.env.APP_URL + url.shortened});
        });
    };

    this.enlargeURL = function(req, res) {
        var calculatedId = '0';
        var shortenedBit = req.params.data;

        for (var i = 0; i < shortenedBit.length; i++) {
            calculatedId += chars.indexOf(shortenedBit[i]);
        }

        calculatedId = Number(calculatedId);

        URL.find({id: calculatedId, shortened: shortenedBit}, function (err, urls) {
            if (err) {
                return res.json(500, {
                    message: 'Error',
                    error: err
                });
            }
            if (urls.length == 0) {
                return res.status(404)
                    .send('Not found');
            }
            return res.redirect(urls[0].full);
        });
    };

    function isValidUrl(str) {
        // Regex from https://gist.github.com/dperini/729294
        var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regex.test(str);
    }

}

module.exports = URLService;