'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', function ($scope, $http, $location, $rootScope, Auth) {

  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;    

  $scope.usersPinsArray = [];

  $http.get('/api/pins/').success(function(response) { 
    // console.log(response);
    $scope.allPins = response;
  });

  $scope.goToUserPage = function(pin) {
    $rootScope.user_id = pin.author_id;
    $rootScope.author_name = pin.author_name;
    $location.path('/userpage/' + pin.author_name);
    console.log("page loaded");
    test();
  };

  var test = function() {
    $scope.showAllPins = true;
    $scope.getUsersPins();
  };

  $scope.getUsersPins = function() {
    $http.get('/api/pins/userPins/' + $rootScope.user_id).success(function(response) {
      console.log(response);
      $scope.allUsersPins = response;
    });
  };

  $scope.getUsersCollections = function() {
    $http.get('/api/pincollections/usersCollections/' + $rootScope.user_id).success(function(response) {
      console.log(response);
      $scope.usersCollections = response;
    });  
  };

  $scope.showPinsInCollection = function(collection) {
    $scope.collection = collection;
    $scope.showPins = true;
  };    

});
