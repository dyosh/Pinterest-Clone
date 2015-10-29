'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', function ($scope, $http, $location, $rootScope, Auth) {
  
  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;    

  $scope.goToUserPage = function(pin) {
    $rootScope.user_id = pin.author_id;
    $rootScope.author_name = pin.author_name;
    $location.path('/userpage/' + pin.author_name);
    console.log("page loaded");
  };

  $scope.getUsersPins = function() {
    $http.get('/api/pins/userPins/' + $rootScope.user_id).success(function(response) {
      console.log(response);
      $scope.showAllPins = true;
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

  if ($location.$$path === '/') {
    $http.get('/api/pins/').success(function(response) { 
      // console.log(response);
      $scope.allPins = response;
    });
  } 
  else if ($location.$$path.substr(1, 8) === 'userpage') {
    $scope.getUsersPins();
  }
  console.log($location.$$path);  

});
