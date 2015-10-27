'use strict';

angular.module('pinterestApp')
  .controller('MypinsCtrl', function ($scope, $rootScope, $http, Auth) {

  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;    

  $scope.createNewPin = function(pinCollection, pin) {
    pin['author_id'] = $scope.getCurrentUser()._id;
    pin['author_name'] = $scope.getCurrentUser().name;

    pinCollection['pins'] = pin;
    pinCollection['author_id'] = $scope.getCurrentUser()._id;
    pinCollection['author_name'] = $scope.getCurrentUser().name;

    $http.post('/api/pins/', pinCollection).success(function(response) {
      console.log(response);
      $scope.getUsersPins();
    });
  };

  $scope.getUsersPins = function() {
    $scope.usersPinsArray = [];

    $http.get('/api/pins/userPins/collections/' + $scope.getCurrentUser()._id).success(function(response) {
      console.log(response);
      
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < response[i].pins.length; j++) {
          console.log(response[i].pins[j].title);
        }
      }
      
    });  
  };
  // fetch data when page is loaded
  // $scope.getUsersPins();

  $scope.getUsersCollections = function() {
    $http.get('/api/pins/userPins/collections/' + $scope.getCurrentUser()._id).success(function(response) {
      console.log(response);
      $scope.usersCollections = response;
    });  
  };
  $scope.getUsersCollections();

  $scope.showPinsInCollection = function(collection) {
    $scope.collection = collection;
    $scope.showPins = true;
  };

  $scope.addToCollection = function(newPin, collection) {
    newPin['author_name'] = $scope.getCurrentUser().name;
    newPin['author_id'] = $scope.getCurrentUser()._id;
    collection.pins.push(newPin);

    console.log(collection);

    $http.put('/api/pins/userPins/collections/addPinToCollection/' + collection._id, collection).success(function(response) {
      console.log(response);
    });
  };  

  $scope.deletePin = function(pin) {
    console.log(pin);

    // remove pin from collection
    $http.delete('/api/pins/' + pin._id).then(function() {
      $scope.showDeleteBox = false;
      $scope.showPinEdit = false;
      var test = document.getElementById('wrapper');
      test.style.opacity = 1.0;
      $scope.getUsersPins();
    });
  };   

  $scope.editPin = function(selectedPin, collection, index) {
    var test = document.getElementById('wrapper');
    test.style.opacity = 0.4;
    $scope.showPinEdit  = true;
    $scope.pinToEdit = selectedPin;
    $scope.pinToEditCollection = collection;
    $scope.pinToEditIndex = index;

    $scope.titleHolder = selectedPin.title;
    $scope.urlHolder = selectedPin.url;
  };  

  $scope.submitEdit = function(updatedPin) {
    updatedPin['author_name'] = $scope.getCurrentUser().name;
    updatedPin['author_id'] = $scope.getCurrentUser()._id;

    $scope.pinToEditCollection.pins[$scope.pinToEditIndex] = updatedPin;
    console.log($scope.pinToEditCollection);

    $http.put('/api/pins/userPins/collections/addPinToCollection/' + $scope.pinToEditCollection._id, $scope.pinToEditCollection).success(function(response) {
      console.log(response);
      $scope.getUsersPins;
      var test = document.getElementById('wrapper');
      test.style.opacity = 1.0;
      $scope.showPinEdit = false;

      // Lets variables be garbage collected to prevent mem leaks?
      $scope.pinToEdit = null; 
      $scope.pinToEditCollection = null;
      $scope.pinToEditIndex = null;
    });

  };  

  $scope.cancelEdit = function() {
    // $scope.getUsersPins() used here to prevent name from changing on cancel.
    // $scope.pinToEdit seems to be referencing $scope.pin memory
    $scope.pinToEdit.title = $scope.titleHolder;
    $scope.pinToEdit.url = $scope.urlHolder;

    $scope.pinToEdit = null; 
    $scope.pinToEditCollection = null;
    $scope.pinToEditIndex = null;

    $scope.titleHolder = null;
    $scope.urlHolder = null;

    $scope.showPinEdit = false;
    console.log($scope.usersPins);
    var test = document.getElementById('wrapper');
    test.style.opacity = 1.0;
  };



  });
