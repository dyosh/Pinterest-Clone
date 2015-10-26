'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinSchema = new Schema({
  title: String,
  url: String,
  author_id: String,
  author_name: String
}, {strict: false});

module.exports = mongoose.model('Pin', PinSchema);