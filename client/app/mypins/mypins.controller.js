'use strict';

angular.module('pinterestApp')
  .controller('MypinsCtrl', function ($scope, $http, Auth) {


  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;    

  $scope.usersPinsArray = [];

  $scope.createNewPin = function(info) {
    info['author_id'] = $scope.getCurrentUser()._id;
    info['author_name'] = $scope.getCurrentUser().name;

    $http.post('/api/pins/', info).success(function(response) {
      // console.log(response);
      $scope.getUsersPins();
    });
  };

  $scope.getUsersPins = function() {
    $http.get('/api/pins/userPins/' + $scope.getCurrentUser()._id).success(function(response) {
      $scope.usersPinsArray = response;
      $scope.usersPins = $scope.usersPinsArray;
      console.log($scope.usersPinsArray);
    });
  };
  // fetch data when page is loaded
  $scope.getUsersPins();

  // $scope.getUsersCollections = function() {
    
  // };

  $scope.editPin = function(selectedPin) {
    console.log(selectedPin);
    var test = document.getElementById('wrapper');
    test.style.opacity = 0.4;
    $scope.showPinEdit  = true;
    $scope.pinToEdit = selectedPin;
    console.log(selectedPin);
  };

  $scope.deletePin = function(pin) {
    console.log(pin);
    $http.delete('/api/pins/' + pin._id).then(function() {
      $scope.showDeleteBox = false;
      $scope.showPinEdit = false;
      var test = document.getElementById('wrapper');
      test.style.opacity = 1.0;
      $scope.getUsersPins();
    });
  };

  $scope.cancelEdit = function() {
    // $scope.getUsersPins() used here to prevent name from changing on cancel.
    // $scope.pinToEdit seems to be referencing $scope.pin memory
    $scope.getUsersPins();

    $scope.showPinEdit = false;
    console.log($scope.usersPins);
    var test = document.getElementById('wrapper');
    test.style.opacity = 1.0;
  };

  $scope.submitEdit = function(updatedPin) {
    updatedPin['author_name'] = $scope.getCurrentUser().name;
    updatedPin['author_id'] = $scope.getCurrentUser()._id;

    console.log(updatedPin);

    $http.put('/api/pins/' + updatedPin._id, updatedPin).success(function(response) {
      console.log(response);

      $scope.getUsersPins;

      var test = document.getElementById('wrapper');
      test.style.opacity = 1.0;
      $scope.showPinEdit = false;
    });
  };



    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };
  

  });
