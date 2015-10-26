'use strict';

var _ = require('lodash');
var Pincollection = require('./pincollection.model');

// Get list of pincollections
exports.index = function(req, res) {
  Pincollection.find(function (err, pincollections) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pincollections);
  });
};

// Get a single pincollection
exports.show = function(req, res) {
  Pincollection.findById(req.params.id, function (err, pincollection) {
    if(err) { return handleError(res, err); }
    if(!pincollection) { return res.status(404).send('Not Found'); }
    return res.json(pincollection);
  });
};

// Creates a new pincollection in the DB.
exports.create = function(req, res) {
  Pincollection.create(req.body, function(err, pincollection) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pincollection);
  });
};

// Updates an existing pincollection in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pincollection.findById(req.params.id, function (err, pincollection) {
    if (err) { return handleError(res, err); }
    if(!pincollection) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pincollection, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pincollection);
    });
  });
};

// Deletes a pincollection from the DB.
exports.destroy = function(req, res) {
  Pincollection.findById(req.params.id, function (err, pincollection) {
    if(err) { return handleError(res, err); }
    if(!pincollection) { return res.status(404).send('Not Found'); }
    pincollection.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}