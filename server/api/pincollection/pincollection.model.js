'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;  

var PincollectionSchema = new Schema({
  // collection_name: String,
  // pins: [Pin]
});

module.exports = mongoose.model('Pincollection', PincollectionSchema);