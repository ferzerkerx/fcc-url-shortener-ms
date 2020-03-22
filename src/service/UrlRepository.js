'use strict';

const URL = require('../models/URL.js')

class UrlRepository {
  constructor() {}

  async save(urlObj) {
    return new Promise((resolve, reject) => {
      new URL({
        id: urlObj.calculatedId,
        shortened: urlObj.shortened,
        full: urlObj.originalUrl,
      }).save(urlObj, function(err, url) {
        if (err) {
          reject(err);
        }

        resolve(url);
      });
    });
  }
}

module.exports = UrlRepository;
