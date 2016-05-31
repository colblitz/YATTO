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
          "state": $rootScope.state
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
      methods: Object.keys(Methods).map(function(m) { return 1; }),
      priorities: {
        1: Object.keys(artifactInfo).filter(function(a) { return artifactInfo[a].world == 1; }).map(function(a) { return [artifactInfo[a].id, 0]}),
        2: Object.keys(artifactInfo).filter(function(a) { return artifactInfo[a].world == 2; }).map(function(a) { return [artifactInfo[a].id, 0]}),
      },
      relics: 0,
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

    $scope.loginText = "Login";
    $scope.isCollapsed = false;


    // var defaultA = Object.keys(artifactInfo).map(function(a) { return artifactInfo[a].id + ".0"; }).join();
    // var defaultW = Object.keys(heroInfo).map(function(w) { return "0"; }).join();
    // var defaultL = Object.keys(heroInfo).map(function(l) { return "0"; }).join();
    // var defaultC = "0,0,0,0,0,0";
    // var defaultM = "1,1,1,1,0,0";
    // var defaultP = Object.keys(artifactInfo).map(function(a) { return artifactInfo[a].id + ".0"; }).join();

    // $rootScope.state = [
    //   $rootScope.versionS, // 0 - version
    //   defaultA, //  1 - artifacts
    //   defaultW, //  2 - weapons
    //   defaultL, //  3 - levels
    //   defaultC, //  4 - customizations
    //   defaultM, //  5 - methods
    //   0,        //  6 - relics
    //   0,        //  7 - nsteps
    //   0,        //  8 - w_getting
    //   0,        //  9 - r_cstage
    //   0,        // 10 - r_undead
    //   0,        // 12 - r_levels
    //   0,        // 13 - active
    //   0,        // 14 - critss
    //   0,        // 15 - zerker

    //   0,        // 16 - a_currentSeed
    //   defaultP, // 17 - a_aPriorities
    //   0,        // 18 - a_maxDiamonds
    //   0,        // 19 - w_currentSeed
    //   0,        // 20 - w_toCalculate
    //   0,        // 21 - memory
    // ].join("|");


    log($rootScope.state);
  };

  $scope.getStateString = function() {
    return JSON.stringify($rootScope.state);
  };



  $scope.loadFromState = function(state) {
    log("loadFromState with: ");
    console.log(state);
    // TODO: validation
    $.extend($rootScope.state, state);

    log("rootScope state now: ");
    console.log($rootScope.state);

    // $rootScope.state.version   = state.version;
    // $rootScope.state.world     = state.world;
    // $rootScope.state.artifacts = state.artifacts;
    // $rootScope.state.weapons   = state.weapons;
    // $rootScope.state.levels      = state.levels;
    // $rootScope.state.customizations = state.customizations;
    // $rootScope.state.methods = state.methods;
    // $rootScope.state.priorities = state.priorities;
    // $rootScope.state.relics = state.relics;
    // $rootScope.state.nsteps = state.nsteps;
    // $rootScope.state.relicCStage = state.relicCStage;
    // $rootScope.state.relicUndead = state.relicUndead;
    // $rootScope.state.relicLevels = state.relicLevels;
    // $rootScope.state.useActives = state.useActives;
    // $rootScope.state.levelCrit = state.levelCrit;
    // $rootScope.state.levelTDMG = state.levelTDMG;
    // $rootScope.state.seedArtifact = state.seedArtifact;
    // $rootScope.state.seedDiamonds = state.seedDiamonds;
    // $rootScope.state.seedWeapons = state.seedWeapons;
    // $rootScope.state.seedCalculate = state.seedCalculate;
    // $rootScope.state.memory = state.memory;

    $scope.$broadcast("stateUpdate");
  };

  $scope.switch = function() {
    $rootScope.world = 3 - $rootScope.world;
    $scope.$broadcast("worldUpdate");
  };

  $scope.updateState = function(field, value) {
    $rootScope[field] = value;
  };

  $scope.loadStateFromCookies = function() {
    var cookies = localStorageService.get('autoc');
    if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }
    var state = localStorageService.get('state');
    console.log("got from cookies: ");
    console.log(state);
    if (isNonNull(state)) { $scope.loadFromState(state); }
  };

  // $scope.getSS = function(i) {
  //   return $rootScope.split("|")[i];
  // };

  // $scope.updateSS = function(i, value) {
  //   log("updating SS");
  //   var t = $rootScope.state.split("|");
  //   t[i] = value;
  //   $rootScope.state = t.join("|");
  // };

  $scope.saveStateToCookies = function() {
    console.log("storing to cookies: ");
    console.log($rootScope.state);
    localStorageService.set('state', $rootScope.state);
  }

  // $scope.saveS = function() {
  //   localStorageService.set('state', $rootScope.state);
  // };

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

        // $rootScope.amViewer = false ???

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
      if ($rootScope.amViewing) {
        $scope.loginText = "Login";
        $scope.checkLoggedIn();
      } else {
        $scope.logout();
      }
    } else {
      if ($rootScope.amViewing) {
      // if ($scope.loginText.indexOf("viewing") > -1) {
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
      $scope.loadFromState(stateObject);
    }).error(function(data, status, headers, config) {
      log("get state failed with error: " + data.err);
    });
  };

  $scope.saveState = function() {
    if ($rootScope.loggedIn) {
      $http({
        method: "POST",
        url: "state",
        data: {
          "state": $scope.getStateString()
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

  // Check
  // username param
  // logged in
  // cookies


  // var state = localStorageService.get('state');
  // if (isNonNull(state) && state[0] != "v") {
  //   localStorageService.remove('state');
  // } else {
  //   if (isNonNull(state)) { $rootScope.state = state; }
  // }



  // if ("state" in $routeParams) {
  //   $rootScope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
  //   // $scope.importFromString($rootScope.state, false);
  // }

  if ("username" in $routeParams) {
    var username = $routeParams.username;
    // $scope.getState(username);

    // force update in other controllers
    // $scope.$broadcast("stateUpdate");
  } else {
    $http({
      method: "POST",
      url: "check"
    }).success(function(data, status, headers, config) {
      var user = data.content;
      if (user != null) {
        $rootScope.loggedIn = true;

        // TODO: change this to $scope.amViewing or something
        if ($scope.loginText.indexOf("viewing") < 0) {
          $scope.loginText = "Logout (" + user.username + ")";
          $rootScope.username = user.username;

          $scope.getState($rootScope.username);
        }
      } else {
        log("not logged in");
      }

      // force update in other controllers
      $scope.$broadcast("stateUpdate");
    }).error(function(data, status, headers, config) {
      log("check failed with error: " + data.err);
    });
  }
});