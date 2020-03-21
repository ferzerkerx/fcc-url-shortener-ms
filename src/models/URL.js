'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var URL = new Schema({
  id: String,
  shortened: String,
  full: String,
});

module.exports = mongoose.model('URL', URL);
