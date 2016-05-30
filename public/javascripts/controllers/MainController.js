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
    $rootScope.username = "";
    $rootScope.versionS = "v4.1.1";
    $rootScope.aCookies = 'On';

    $rootScope.world = 2;

    var defaultA = Object.keys(artifactInfo).map(function(a) { return artifactInfo[a].id + ".0"; }).join();
    var defaultW = Object.keys(heroInfo).map(function(w) { return "0"; }).join();
    var defaultL = Object.keys(heroInfo).map(function(l) { return "0"; }).join();
    var defaultC = "0,0,0,0,0,0";
    var defaultM = "1,1,1,1,0,0";
    var defaultP = Object.keys(artifactInfo).map(function(a) { return artifactInfo[a].id + ".0"; }).join();

    $rootScope.state = [
      $rootScope.versionS, // 0 - version
      defaultA, //  1 - artifacts
      defaultW, //  2 - weapons
      defaultL, //  3 - levels
      defaultC, //  4 - customizations
      defaultM, //  5 - methods
      0,        //  6 - relics
      0,        //  7 - nsteps
      0,        //  8 - w_getting
      0,        //  9 - r_cstage
      0,        // 10 - r_undead
      0,        // 12 - r_levels
      0,        // 13 - active
      0,        // 14 - critss
      0,        // 15 - zerker

      0,        // 16 - a_currentSeed
      defaultP, // 17 - a_aPriorities
      0,        // 18 - a_maxDiamonds
      0,        // 19 - w_currentSeed
      0,        // 20 - w_toCalculate
      0,        // 21 - memory
    ].join("|");

    $scope.loginText = "Login";
    $scope.isCollapsed = false;
    log($rootScope.state);
  };

  $scope.getSS = function(i) {
    return $rootScope.split("|")[i];
  };

  $scope.updateSS = function(i, value) {
    log("updating SS");
    var t = $rootScope.state.split("|");
    t[i] = value;
    $rootScope.state = t.join("|");
  };

  $scope.saveS = function() {
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
      var state = localStorageService.get('state');
      console.log("cookies");
      if (isNonNull(state)) { $rootScope.state = state; }
      $scope.$broadcast("stateUpdate");
    }).error(function(data, status, headers, config) {
      console.log(log("logout error: " + data.err));
    });
  };

  $scope.login = function() {
    log("login");
    if ($rootScope.loggedIn) {
      // TODO: change this to $scope.amViewing or something
      if ($scope.loginText.indexOf("viewing") > -1) {
        $scope.loginText = "Login";
        // TODO: this is duplicate code, refactor
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
          }

          // force update in other controllers
          $scope.$broadcast("stateUpdate");
        }).error(function(data, status, headers, config) {
          console.log(log("check failed with error: " + data.err));
        });
      } else {
        $scope.logout();
      }
    } else {
      if ($scope.loginText.indexOf("viewing") > -1) {
        $scope.loginText = "Login";
        $rootScope.loggedIn = false;
        $rootScope.username = "";

        var cookies = localStorageService.get('autoc');
        if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }

        var state = localStorageService.get('state');
        if (isNonNull(state)) { $rootScope.state = state; }
        $scope.$broadcast("stateUpdate");
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
              $rootScope.state = info.state.state;
              $scope.$broadcast("stateUpdate");
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
      $rootScope.state = data.content;
      console.log($rootScope.state);
      $scope.$broadcast("stateUpdate");
    }).error(function(data, status, headers, config) {
      console.log(log("get state failed with error: " + data.content));
    });
  };

  $scope.saveState = function() {
    if ($rootScope.loggedIn) {
      $http({
        method: "POST",
        url: "state",
        data: {
          "state": $rootScope.state
        }
      }).success(function(data, status, headers, config) {
        $rootScope.stateSavedSuccessfully = true;
        setTimeout(function() {
          $rootScope.$apply(function() {
            $rootScope.stateSavedSuccessfully = false
          });
        }, 1000);
      }).error(function(data, status, headers, config) {
        console.log(log("error saving state: " + data));
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
        console.log(log("statefile saved"));
      }).error(function(data, status, headers, config) {
        console.log(log("error saving statefile: " + data));
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

  // var state = localStorageService.get('state');
  // if (isNonNull(state) && state[0] != "v") {
  //   localStorageService.remove('state');
  // } else {
  //   if (isNonNull(state)) { $rootScope.state = state; }
  // }

  var cookies = localStorageService.get('autoc');
  if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }

  if ("state" in $routeParams) {
    $rootScope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
    // $scope.importFromString($rootScope.state, false);
  }

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
        console.log(log("not logged in"));
      }

      // force update in other controllers
      $scope.$broadcast("stateUpdate");
    }).error(function(data, status, headers, config) {
      console.log(log("check failed with error: " + data.err));
    });
  }
});