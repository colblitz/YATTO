yattoApp.controller('ModalController', function ($scope, $rootScope, $http, $modalInstance) {
  $scope.username = "";
  $scope.password = "";

  $scope.processKeypress = function(event) {
    if (event.which === 13) {
      $scope.login();
    }
  }

  $scope.login = function() {
    // do login
    if ($scope.password == "") {
      $modalInstance.close({
        loggedIn: false,
        username: $scope.username
      });
    } else {
      $http({
        method: "POST",
        url: "login",
        data: {
          "username": $scope.username,
          "password": $scope.password
        }
      }).success(function(data, status, headers, config) {
        $modalInstance.close({
          loggedIn: true,
          username: data.content.username,
          state: data.content.state
        });
      }).error(function(data, status, headers, config) {
        $scope.message = data.err;
      });
    }
  }

  $scope.register = function() {
    // do register
    $http({
      method: "POST",
      url: "register",
      data: {
        "username": $scope.username,
        "password": $scope.password
      }
    }).success(function(data, status, headers, config) {
      var user = data.content;
      $rootScope.loggedIn = true;

      // successfully registered, send state
      $http({
        method: "POST",
        url: "state",
        data: {
          "state": $rootScope.stateString
        }
      }).success(function(data, status, headers, config) {
        $modalInstance.close({
          loggedIn: true,
          username: user.username,
          state: user.state
        });
      }).error(function(data, status, headers, config) {
        $scope.message = data.err;
      });
    }).error(function(data, status, headers, config) {
      $scope.message = data.err;
    });
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

yattoApp.controller('MainController', function($scope, $rootScope, $http, $modal, $routeParams, localStorageService) {
  var verbose = true;
  var log = function(s) {
    if (verbose) {
      console.log("[MainController] " + s);
    }
  };

  log("start of file");

  var setDefaults = function() {
    log("setting defaults");
    $rootScope.loggedIn = false;
    $rootScope.amViewer = false;
    $rootScope.username = "";
    $rootScope.versionS = "v4.1.1";
    $rootScope.aCookies = 'On';
    $rootScope.world = 2;

    $rootScope.state = {
      version: $rootScope.versionS,
      world: $rootScope.world,
      // 1: [[id, level], [id, level]]
      artifacts: {
        1: Object.keys(artifactInfo).filter(function(a) { return artifactInfo[a].world == 1; }).map(function(a) { return [artifactInfo[a].id, 0]}),
        2: Object.keys(artifactInfo).filter(function(a) { return artifactInfo[a].world == 2; }).map(function(a) { return [artifactInfo[a].id, 0]}),
      },
      weapons: Object.keys(heroInfo).map(function(w) { return 0; }),
      levels: {
        1: Object.keys(heroInfo).map(function(l) { return 0; }),
        2: Object.keys(heroInfo).map(function(l) { return 0; }),
      },
      customizations: cBonus.map(function(c) { return 0; }),
      ownedCustomizations: [],
      methods: Object.keys(Methods).map(function(m) { return 1; }),
      priorities: {
        1: Object.keys(artifactInfo).filter(function(a) { return artifactInfo[a].world == 1; }).map(function(a) { return [artifactInfo[a].id, 0]}),
        2: Object.keys(artifactInfo).filter(function(a) { return artifactInfo[a].world == 2; }).map(function(a) { return [artifactInfo[a].id, 0]}),
      },
      relics: {1: 0, 2: 0},
      nsteps: 0,
      relicCStage: 0,
      relicUndead: 0,
      relicLevels: 0,
      useActives: 0,
      levelCrit: 0,
      levelTDMG: 0,
      seedArtifact: 0,
      seedDiamonds: 0,
      seedWeapons: 0,
      seedCalculate: 0,
      memory: 0,
    };
    $rootScope.stateString = $scope.getStateString();

    $scope.loginText = "Login";
    $scope.isCollapsed = false;
  };

  $scope.getStateString = function() {
    return JSON.stringify($rootScope.state);
  };

  $scope.loadFromState = function(state) {
    log("loading from state");
    // TODO: validation
    $.extend($rootScope.state, state);
    $rootScope.stateString = $scope.getStateString();

    $scope.$broadcast("stateUpdate");
    return true;
  };

  $scope.switch = function() {
    $rootScope.world = 3 - $rootScope.world;
    $scope.$broadcast("worldUpdate");
  };

  $scope.loadStateFromCookies = function() {
    console.log("loading state from cookies");
    var cookies = localStorageService.get('autoc');
    if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }
    var state = localStorageService.get('state');
    if (isNonNull(state)) { $scope.loadFromState(state); }
  };

  $scope.saveStateToCookies = function() {
    console.log("save state to cookies: ");
    console.log($rootScope.state);
    localStorageService.set('state', $rootScope.state);
  };

  $scope.toggle = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
    localStorageService.set('toggle', $scope.isCollapsed);
  };

  $scope.logout = function() {
    log("logout");
    $http({
      method: "POST",
      url: "logout"
    }).success(function(data, status, headers, config) {
      $scope.loginText = "Login";
      $rootScope.loggedIn = false;
      $rootScope.username = "";

      // go back to cookies
      $scope.loadStateFromCookies();
    }).error(function(data, status, headers, config) {
      log("logout error: " + data.err);
    });
  };

  $scope.checkLoggedIn = function() {
    $http({
      method: "POST",
      url: "check"
    }).success(function(data, status, headers, config) {
      var user = data.content;
      if (user != null) {
        $rootScope.loggedIn = true;

        if (!$rootScope.amViewer) {
          $scope.loginText = "Logout (" + user.username + ")";
          $rootScope.username = user.username;

          $scope.getState($rootScope.username);
        }
      }

      // force update in other controllers
      $scope.$broadcast("stateUpdate");
    }).error(function(data, status, headers, config) {
      log("check failed with error: " + data.err);
    });
  };

  $scope.login = function() {
    log("login called");
    if ($rootScope.loggedIn) {
      // if still logged in, go back to logged in user
      if ($rootScope.amViewer) {
        $scope.loginText = "Login";
        $scope.checkLoggedIn();
      } else {
        $scope.logout();
      }
    } else {
      if ($rootScope.amViewer) {
        $scope.loginText = "Login";
        $rootScope.loggedIn = false;
        $rootScope.username = "";

        // try getting from cookies
        $scope.loadStateFromCookies();
      } else {
        var modalInstance = $modal.open({
          templateUrl: 'loginModal.html',
          controller: 'ModalController',
          size: 'sm',
          resolve: {}
        });

        modalInstance.result.then(function (info) {
          if (info.loggedIn) {
            if (info.username) {
              $rootScope.loggedIn = true;
              $scope.loginText = "Logout (" + info.username + ")";
            }
            if (info.state) {
              var stateObject = JSON.parse(info.state.state);
              $scope.loadFromState(stateObject);
            }
          } else {
            if (info.username) {
              $scope.viewingUser(info.username);
            }
          }
        }, function () {
          console.log("i wuz here");
        });
      }
    }
  };

  $scope.viewingUser = function(username) {
    $scope.getState(username);
    $rootScope.amViewer = true;
    $rootScope.loggedIn = false;
    $rootScope.aCookies = 'Off';
    $scope.loginText = "Stop viewing (" + username + ")";
  };

  $scope.getState = function(username) {
    log("get state");
    $http({
      method: "GET",
      url: "state",
      params: {
        "username" : username
      }
    }).success(function(data, status, headers, config) {
      var stateObject = JSON.parse(data.content);
      return $scope.loadFromState(stateObject);
    }).error(function(data, status, headers, config) {
      log("get state failed with error: " + data.err);
    });
  };

  $scope.saveState = function() {
    log("saving state");
    if ($rootScope.loggedIn) {
      $http({
        method: "POST",
        url: "state",
        data: {
          "state": $rootScope.stateString
        }
      }).success(function(data, status, headers, config) {
        $rootScope.stateSavedSuccessfully = true;
        setTimeout(function() {
          $rootScope.$apply(function() {
            $rootScope.stateSavedSuccessfully = false
          });
        }, 1000);
      }).error(function(data, status, headers, config) {
        log("save state failed with error: " + data.err);
      });
    }
  };

  $scope.saveStateFile = function(filestring) {
    if ($rootScope.loggedIn) {
      $http({
        method: "POST",
        url: "filestate",
        data: {
          "state": filestring
        }
      }).success(function(data, status, headers, config) {
        log("statefile saved");
      }).error(function(data, status, headers, config) {
        log("error saving statefile: " + data);
      });
    }
  };

  window.onbeforeunload = function (event) {
    $scope.saveState();
  };

  setDefaults();

  // Get things from cookies
  var toggled = localStorageService.get('toggle');
  if (isNonNull(toggled)) { $scope.isCollapsed = toggled; }
  var cookies = localStorageService.get('autoc');
  if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }

  if ("username" in $routeParams) {
    var username = $routeParams.username;
    $scope.getState(username);
  } else {
    $http({
      method: "POST",
      url: "check"
    }).success(function(data, status, headers, config) {
      var user = data.content;
      if (user != null) {
        $rootScope.loggedIn = true;

        if (!$rootScope.amViewer) {
          $scope.loginText = "Logout (" + user.username + ")";
          $rootScope.username = user.username;
          $scope.getState($rootScope.username);
        }
      } else {
        log("not logged in, try getting from cookies");
        $scope.loadStateFromCookies();
      }
    }).error(function(data, status, headers, config) {
      log("check failed with error: " + data.err);
    });
  }
  log("end of main");
});