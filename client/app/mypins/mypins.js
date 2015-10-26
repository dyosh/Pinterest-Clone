'use strict';

angular.module('pinterestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mypins', {
        templateUrl: 'app/mypins/mypins.html',
        controller: 'MypinsCtrl'
      });
  });
