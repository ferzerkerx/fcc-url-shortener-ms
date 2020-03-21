'use strict';

var URLService = require('../service/URLService.js');

module.exports = function(app) {
  var urlService = new URLService();

  app.route('/new/:data*').get(urlService.shortenURL);

  app.route('/:data').get(urlService.enlargeURL);
};
