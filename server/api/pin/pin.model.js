'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PinSchema = new Schema({
  title: String,
  url: String,
  author_id: String,
  author_name: String
}, {strict: false});

var PinCollection = new  Schema({
  author_id: String,
  author_name: String,
  collection_name: String,
  pins: [PinSchema]
}, {strict: false});

module.exports = mongoose.model('Pin', PinCollection);