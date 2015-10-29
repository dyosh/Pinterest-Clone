'use strict';

angular.module('pinterestApp')
  .controller('MypinsCtrl', function ($scope, $rootScope, $http, Auth) {

  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;

  $scope.imagePlaceholderURL = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQgZtN9b4_6dJQzovDjx2EIgRjBYhcImELi_EBCkmNUc6xJUaHmmA";    

  $scope.createNewPin = function(newPin) {
    newPin['author_id'] = $scope.getCurrentUser()._id;
    newPin['author_name'] = $scope.getCurrentUser().name;

    $http.post('/api/pins/', newPin).success(function(response) {
      console.log(response);
      $scope.newPin = null;
      $scope.getUsersPins();
    });
  };

  $scope.createNewCollection = function(pinCollection, pin) {
    pin['author_id'] = $scope.getCurrentUser()._id;
    pin['author_name'] = $scope.getCurrentUser().name;

    pinCollection['collection_author_id'] = $scope.getCurrentUser()._id;
    pinCollection['collection_author_name'] = $scope.getCurrentUser().name;

    $http.post('/api/pins/', pin).success(function(response) {
      console.log(response);
      $scope.pinWith_id = response;
      pinCollection['pins'] = response;
      $http.post('/api/pincollections/', pinCollection).success(function(response) {
        // add the collections _id to the pin to keep track of whether or not a pin
        // belongs to a collection or not.
        // have to repost with updated collection_id on pin. unfortunate :(, super expensive to do this.
        var finalNewPinUpdate = response.pins[0];
        finalNewPinUpdate['collection_id'] = response._id;

        var finalNewCollection = response;
        finalNewCollection.pins[0] = finalNewPinUpdate

        console.log(finalNewPinUpdate);
        console.log(finalNewCollection);

        // better way to do this than chaining? Should chain both put requests together, then
        // populate on screen, but not sure how.
        $http.put('/api/pins/' + finalNewPinUpdate._id, finalNewPinUpdate).success(function(response) {
          console.log("PIN UPDATED SUCCESSFULLY");
        }).then(function() {
          $http.put('/api/pinCollections/' + finalNewCollection._id, finalNewCollection).success(function(response) {
            console.log("COLLECTION UPDATED SUCCESSFULLY");
          }).then(function() {
            $scope.newPin = null;     
            $scope.getUsersCollections();
          });
        });
      });

    });
  };

  $scope.getUsersPins = function() {
    $http.get('/api/pins/userPins/' + $scope.getCurrentUser()._id).success(function(response) {
      console.log(response);
      $scope.allUsersPins = response;
    });
  };
  // fetch pins when page is loaded
  $scope.getUsersPins();
  $scope.showAllPins = true;

  $scope.getUsersCollections = function() {
    $http.get('/api/pincollections/usersCollections/' + $scope.getCurrentUser()._id).success(function(response) {
      console.log(response);
      $scope.usersCollections = response;
    });  
  };
  // fetch collections when page is loaded
  // $scope.getUsersCollections();
  // $scope.showCollections = true;

  $scope.showAddToCollection = function(collection, index) {
    $scope.collectionToEdit = collection;
    $scope.collectionToEditIndex = index;
    $scope.showAddPinToCollectionBox = true;
    var collectionArea = document.getElementById('collection-area');
    collectionArea.style.opacity = 0.2;
  };

  $scope.addToCollection = function(newPin) {
    newPin['author_name'] = $scope.getCurrentUser().name;
    newPin['author_id'] = $scope.getCurrentUser()._id;
    newPin['collection_id'] = $scope.collectionToEdit._id;

    $http.post('/api/pins/', newPin).success(function(response) {
      console.log(response);
      $scope.collectionToEdit.pins.push(response);
      
      $http.put('/api/pinCollections/' + $scope.collectionToEdit._id, $scope.collectionToEdit).success(function(response) {
        console.log(response);
        $scope.showAddPinToCollectionBox = false;

        // TODO: this call to the db is unnecessary, fix this simple solution later. 
        $scope.getUsersCollections();
        var collectionArea = document.getElementById('collection-area');
        collectionArea.style.opacity = 1.0;        
        $scope.newPin = null;     
      })
    });
  };  
  
  $scope.showPinsInCollection = function(collection) {
    $scope.collection = collection;
    $scope.showPins = true;
    var collectionsArea = document.getElementById('collection-area');
    collectionsArea.style.opacity = 0.4;
  };  

  $scope.leavePinsInCollectionArea = function() {
    $scope.showPins = false;
    var collectionsArea = document.getElementById('collection-area');
    collectionsArea.style.opacity = 1.0;
  }; 

  $scope.editPin = function(selectedPin, collection, index) {
    var showAllPinsArea = document.getElementById('show-all-pins-area');
    showAllPinsArea.style.opacity = 0.4;
    $scope.showPinEdit  = true;
    $scope.pinToEdit = selectedPin;
    $scope.collectionToEdit = collection;
    $scope.pinToEditIndex = index;

    $scope.titleHolder = selectedPin.title;
    $scope.urlHolder = selectedPin.url;
  };  

  $scope.submitEdit = function(updatedPin) {
    var updatePinInCollection = function(updatedPin, collection, index) {
      $http.put('/api/pins/' + updatedPin._id, updatedPin).success(function(response) {
        console.log(response);
        $http.put('/api/pinCollections/' + collection._id, collection).success(function(response) {
          console.log(response);
          $scope.collection = response;
          var showAllPinsArea = document.getElementById('show-all-pins-area');
          showAllPinsArea.style.opacity = 1.0;
          $scope.showPinEdit = false;

          // Lets variables be garbage collected faster to prevent mem leaks?
          $scope.pinToEdit = null; 
          $scope.collectionToEdit = null;
          $scope.pinToEditIndex = null;   
          $scope.pinToEdit = null; 
        });
      });  
    };    

    // collection and index were passed in to $scope.editPin
    if ($scope.collectionToEdit !== undefined || $scope.pinToEditIndex !== undefined) { 
      $scope.collectionToEdit.pins[$scope.pinToEditIndex] = updatedPin;
      updatePinInCollection(updatedPin, $scope.collectionToEdit, $scope.pinToEditIndex);
    } 
    else if (updatedPin.collection_id !== undefined) {
      // the pin is in an existing collection. modify both the pin and collection
      // first we need to get the collection then find the index of the pin
      $http.get('/api/pinCollections/' + updatedPin.collection_id).success(function(response) {
        for(var i = 0; i < response.pins.length; i++) {
          if (response.pins[i]._id === updatedPin._id) {
            $scope.pinToEditIndex = i;
            $scope.collectionToEdit = response;
            console.log(response);
            $scope.collectionToEdit.pins[$scope.pinToEditIndex] = updatedPin
            break;
          } 
        }
        updatePinInCollection(updatedPin, $scope.collectionToEdit, $scope.pinToEditIndex);
      });
    }
    else if (updatedPin.collection_id === undefined) {
      // the pin doesn't belong to a collection, we just change the pin itself.
      $http.put('/api/pins/' + updatedPin._id, updatedPin).success(function(response) {
        console.log(response);
        var showAllPinsArea = document.getElementById('show-all-pins-area');
        showAllPinsArea.style.opacity = 1.0;
        $scope.showPinEdit = false;        
      });
    }
  };  

  $scope.deletePin = function(pin) {
    var updatePinInCollection = function(pinToDelete, collection, index) {
      $scope.collectionToEdit.pins.splice($scope.pinToEditIndex, 1);

      // update removed pin from collection
      $http.put('/api/pinCollections/' + $scope.collectionToEdit._id, $scope.collectionToEdit).success(function(response) {
        console.log(response);
        // once complete, delete the pin from the database
        $http.delete('/api/pins/' + pinToDelete._id).then(function() {
          $scope.showDeleteBox = false;
          $scope.showPinEdit = false;

          $scope.getUsersPins();  
          var editBox = document.getElementById('pin-edit-box-delete');
          editBox.style.opacity = 1.0;
          var showAllPinsArea = document.getElementById('show-all-pins-area');
          showAllPinsArea.style.opacity = 1.0;          

          // Lets variables be garbage collected faster to prevent mem leaks?
          $scope.pinToEdit = null; 
          $scope.collectionToEdit = null;
          $scope.pinToEditIndex = null;   
          $scope.pinToEdit = null;                 
        });
      });
    };

    if ($scope.collectionToEdit !== undefined) {
      updatePinInCollection(pin, $scope.collectionToEdit, $scope.collectionToEditIndex);
    } 
    else if (pin.collection_id !== undefined) {
      // the pin is in an existing collection. modify both the pin and collection
      // first we need to get the collection then find the index of the pin
      $http.get('/api/pinCollections/' + pin.collection_id).success(function(response) {
        for(var i = 0; i < response.pins.length; i++) {
          if (response.pins[i]._id === pin._id) {
            $scope.pinToEditIndex = i;
            $scope.collectionToEdit = response;
            $scope.collectionToEdit.pins[$scope.pinToEditIndex] = pin;
            break;
          } 
        }
        updatePinInCollection(pin, $scope.collectionToEdit, $scope.pinToEditIndex);
      });
    }
    else if (pin.collection_id === undefined) {
      // the pin doesn't belong to a collection, we just change the pin itself.
      $http.delete('/api/pins/' + pin._id, pin).success(function(response) {
        $scope.getUsersPins();
        var editBox = document.getElementById('pin-edit-box-delete');
        editBox.style.opacity = 1.0;      
        var showAllPinsArea = document.getElementById('show-all-pins-area');
        showAllPinsArea.style.opacity = 1.0;          

        $scope.showPinEdit = false;        
      });
    }        
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
    var showAllPinsArea = document.getElementById('show-all-pins-area');
    showAllPinsArea.style.opacity = 1.0;
  };   

  $scope.deleteBtnPressed = function() { 
    $scope.showDeleteBox = true;
    var editBox = document.getElementById('pin-edit-box-delete');
    editBox.style.opacity = 0.0;

    // var deleteBoxArea = document.getElementById('del-box-area');
    // deleteBoxArea.style.marginLeft = "150px";
    // deleteBoxArea.style.marginTop = "65px";
  };

  $scope.cancelDeleteBtnPressed = function () {
    $scope.showDeleteBox = false;
    var editBox = document.getElementById('pin-edit-box-delete');
    editBox.style.opacity = 1.0;

    // var deleteBoxArea = document.getElementById('del-box-area');
    // deleteBoxArea.style.marginLeft = "0px";
    // deleteBoxArea.style.marginTop = "0px";
  };

  $scope.cancelAddPinToCollection = function() {
    $scope.showAddPinToCollectionBox = false;
    var collectionArea = document.getElementById('collection-area');
    collectionArea.style.opacity = 1.0;
  };

  });
