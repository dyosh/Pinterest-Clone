'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PincollectionSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Pincollection', PincollectionSchema);