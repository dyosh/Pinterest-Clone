'use strict';

var express = require('express');
var controller = require('./pin.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/userPins/:authorId', controller.userPins);
router.get('/userPins/collections/:authorId', controller.userCollections);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/userPins/collections/addPinToCollection/:id', controller.updateCollection);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;