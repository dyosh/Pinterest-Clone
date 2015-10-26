'use strict';

describe('Controller: MypinsCtrl', function () {

  // load the controller's module
  beforeEach(module('pinterestApp'));

  var MypinsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MypinsCtrl = $controller('MypinsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
