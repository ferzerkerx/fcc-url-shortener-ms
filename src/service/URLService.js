'use strict';

const URL = require('../models/URL.js')

class URLService {
  charsForShortenedUrl = [];

  constructor(urlRepository) {
    this.charsForShortenedUrl = URLService._charsForShortenedUrl();
    this.urlRepository = urlRepository;
  }

  static _charsForShortenedUrl() {
    let charsForShortenedUrl = [];
    for (let i = 97; i < 123; i++) {
      charsForShortenedUrl.push(String.fromCharCode(i));
    }

    for (let i = 65; i < 91; i++) {
      charsForShortenedUrl.push(String.fromCharCode(i));
    }

    for (let i = 48; i < 58; i++) {
      charsForShortenedUrl.push(String.fromCharCode(i));
    }
    return charsForShortenedUrl;
  }

  async shortenURL(req, res) {
    var urlToShorten = req.url.slice(5);

    if (!URLService.isValidUrl(urlToShorten)) {
      return res.json({ error: urlToShorten + ' is not a valid URL' });
    }

    var nowTimeStamp =
      Date.now() +
      urlToShorten.charCodeAt(urlToShorten.length - 1) +
      urlToShorten.charCodeAt(urlToShorten.length - 2);
    var digits = [];
    var remainder = 0;
    var calculatedId = '';
    var shortened = '';

    while (nowTimeStamp > 0) {
      remainder = nowTimeStamp % this.charsForShortenedUrl.length;
      digits.push(remainder);
      nowTimeStamp = Math.round(
        nowTimeStamp / this.charsForShortenedUrl.length
      );
    }

    for (let i = digits.length - 1; i >= 0; i--) {
      shortened += this.charsForShortenedUrl[digits[i]];
      calculatedId += digits[i];
    }
    calculatedId = Number(calculatedId);

    const urlObj = {
      id: calculatedId,
      shortened: shortened,
      full: urlToShorten,
    };

    await this.urlRepository
      .save(urlObj)
      .then(url => {
        return res.json({
          original_url: urlToShorten,
          short_url: process.env.APP_URL + url.shortened,
        });
      })
      .catch(err => {
        return res.json(500, {
          message: 'Error',
          error: err,
        });
      });
  }

  enlargeURL(req, res) {
    var calculatedId = '0';
    var shortenedBit = req.params.data;

    for (var i = 0; i < shortenedBit.length; i++) {
      calculatedId += this.charsForShortenedUrl.indexOf(shortenedBit[i]);
    }

    calculatedId = Number(calculatedId);

    URL.find({ id: calculatedId, shortened: shortenedBit }, function(
      err,
      urls
    ) {
      if (err) {
        return res.json(500, {
          message: 'Error',
          error: err,
        });
      }
      if (urls.length === 0) {
        return res.status(404).send('Not found');
      }
      return res.redirect(urls[0].full);
    });
  }

  static isValidUrl(urlStr) {
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(urlStr);
  }
}

module.exports = URLService;
