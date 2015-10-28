'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;  

var PincollectionSchema = new Schema({
  collection_name: String,
  collection_author_name: String,
  collection_author_id: String,
  pins: Array
});

module.exports = mongoose.model('Pincollection', PincollectionSchema);