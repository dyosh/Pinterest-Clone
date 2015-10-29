'use strict';

angular.module('pinterestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/userpage/:author', {
        templateUrl: 'app/main/userpage.html',
        controller: 'MainCtrl'
      });
  });