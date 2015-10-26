'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {


  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;    

  $scope.usersPinsArray = [];

  $http.get('/api/pins/').success(function(response) { 
    console.log(response);
    $scope.allPins = response;
  });

});
