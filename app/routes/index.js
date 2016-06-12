'use strict';

var path = process.cwd();
var URLService = require(path + '/app/service/URLService.js');

module.exports = function (app) {


    var urlService = new URLService();

    app.route('/:data')
        .get(urlService.shortenUrl);

};