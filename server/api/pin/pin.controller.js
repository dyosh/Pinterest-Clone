'use strict';

var _ = require('lodash');
var Pin = require('./pin.model');

// Get list of pins
exports.index = function(req, res) {
  Pin.find(function (err, pins) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pins);
  });
};

// Get a list of *USERS* pins
exports.userPins = function(req ,res) {
  Pin.find({author_id: req.params.authorId
  }, function(err, pins) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(pins);
  });
};

// Get a list of *USERS COLLECTIONS*
exports.userCollections = function(req, res) {
  Pin.find({author_id: req.params.authorId
  }, function(err, collections) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(collections);
  });

};

// Get a single pin
exports.show = function(req, res) {
  Pin.findById(req.params.id, function (err, pin) {
    if(err) { return handleError(res, err); }
    if(!pin) { return res.status(404).send('Not Found'); }
    return res.json(pin);
  });
};

// Creates a new pin in the DB.
exports.create = function(req, res) {
  Pin.create(req.body, function(err, pin) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pin);
  });
};

// Updates an existing collection in the DB
exports.updateCollection = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pin.findById(req.params.id, function (err, collection) {
    if (err) { return handleError(res, err); }
    if (!collection) { return res.status(404).send('Not Found'); }
    var updated = _.extend(collection, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(collection);
    })
  })
};


// Updates an existing pin in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pin.findById(req.params.id, function (err, pin) {
    if (err) { return handleError(res, err); }
    if(!pin) { return res.status(404).send('Not Found'); }
    var updated = _.extend(pin, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pin);
    });
  });
};

// Deletes a pin from the DB.
exports.destroy = function(req, res) {
  Pin.findById(req.params.id, function (err, pin) {
    if(err) { return handleError(res, err); }
    if(!pin) { return res.status(404).send('Not Found'); }
    pin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}