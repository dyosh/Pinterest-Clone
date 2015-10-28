'use strict';

angular.module('pinterestApp')
  .controller('MypinsCtrl', function ($scope, $rootScope, $http, Auth) {

  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;    

  $scope.createNewCollection = function(pinCollection, pin) {
    pin['author_id'] = $scope.getCurrentUser()._id;
    pin['author_name'] = $scope.getCurrentUser().name;

    pinCollection['collection_author_id'] = $scope.getCurrentUser()._id;
    pinCollection['collection_author_name'] = $scope.getCurrentUser().name;

    $http.post('/api/pins/', pin).success(function(response) {
      console.log(response);
      pinCollection['pins'] = response;
      $http.post('/api/pincollections/', pinCollection).success(function(response) {
        console.log(response);
      })
    });
  };

  $scope.getUsersPins = function() {
    $http.get('/api/pins/userPins/' + $scope.getCurrentUser()._id).success(function(response) {
      console.log(response);
      $scope.allOfUsersPins = response;
    });
  };

  $scope.getUsersCollections = function() {
    $http.get('/api/pincollections/usersCollections/' + $scope.getCurrentUser()._id).success(function(response) {
      console.log(response);
      $scope.usersCollections = response;
    });  
  };
  // fetch collections when page is loaded
  $scope.getUsersCollections();

  $scope.showAddToCollection = function(collection) {
    $scope.collectionToEdit = collection;
    $scope.showAddPinToCollectionBox = true;
  };

  $scope.addToCollection = function(newPin) {
    newPin['author_name'] = $scope.getCurrentUser().name;
    newPin['author_id'] = $scope.getCurrentUser()._id;

    $http.post('/api/pins/', newPin).success(function(response) {
      console.log(response);
      $scope.collectionToEdit.pins.push(response);
      
      $http.put('/api/pinCollections/' + $scope.collectionToEdit._id, $scope.collectionToEdit).success(function(response) {
        console.log(response);
        $scope.showAddPinToCollectionBox = false;
      })
    });
  };  
  
  $scope.showPinsInCollection = function(collection) {
    $scope.collection = collection;
    $scope.showPins = true;
  };  

  $scope.editPin = function(selectedPin, collection, index) {
    var test = document.getElementById('wrapper');
    test.style.opacity = 0.4;
    $scope.showPinEdit  = true;
    $scope.pinToEdit = selectedPin;
    $scope.collectionToEdit = collection;
    $scope.pinToEditIndex = index;

    $scope.titleHolder = selectedPin.title;
    $scope.urlHolder = selectedPin.url;
  };  

  $scope.submitEdit = function(updatedPin) {
    $scope.collectionToEdit.pins[$scope.pinToEditIndex] = updatedPin;
    console.log(updatedPin);
    console.log($scope.collectionToEdit);

    $http.put('/api/pins/' + updatedPin._id, updatedPin).success(function(response) {
      console.log(response);
      $http.put('/api/pinCollections/' + $scope.collectionToEdit._id, $scope.collectionToEdit).success(function(response) {
        console.log(response);
        $scope.getUsersPins;
        var test = document.getElementById('wrapper');
        test.style.opacity = 1.0;
        $scope.showPinEdit = false;

        // Lets variables be garbage collected to prevent mem leaks?
        $scope.pinToEdit = null; 
        $scope.collectionToEdit = null;
        $scope.pinToEditIndex = null;         
      });
    });
  };  

  $scope.cancelEdit = function() {
    $scope.pinToEdit.title = $scope.titleHolder;
    $scope.pinToEdit.url = $scope.urlHolder;

    $scope.pinToEdit = null; 
    $scope.collectionToEdit = null;
    $scope.pinToEditIndex = null;

    $scope.titleHolder = null;
    $scope.urlHolder = null;

    $scope.showPinEdit = false;
    console.log($scope.usersPins);
    var test = document.getElementById('wrapper');
    test.style.opacity = 1.0;
  };

  $scope.deletePin = function(pin) {
    console.log(pin);
    // variables saved from when edit is clicked
    // $scope.pinToEdit = selectedPin;
    // $scope.collectionToEdit = collection;
    // $scope.pinToEditIndex = index;

    $scope.collectionToEdit.pins.splice($scope.pinToEditIndex, 1);

    // update removed pin from collection
    $http.put('/api/pinCollections/' + $scope.collectionToEdit._id, $scope.collectionToEdit).success(function(response) {
      console.log(response);
      // once complete, delete the pin from the database
      $http.delete('/api/pins/' + pin._id).then(function() {
        $scope.showDeleteBox = false;
        $scope.showPinEdit = false;
        var test = document.getElementById('wrapper');
        test.style.opacity = 1.0;
        $scope.getUsersPins();        
      });
    });

  };   


  });
