'use strict';

var URLService = require('../service/URLService.js');
var UrlRepository = require('../service/UrlRepository.js');

module.exports = function(app) {
  const urlService = new URLService(new UrlRepository());

  app.route('/new/:data*').get((req, res) => urlService.shortenURL(req, res));

  app.route('/:data').get((req, res) => urlService.enlargeURL(req, res));
};
