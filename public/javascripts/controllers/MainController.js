yattoApp.controller('ModalController', function ($scope, $rootScope, $http, $modalInstance) {
	$scope.username = "";
	$scope.password = "";

	$scope.login = function() {
		// do login
		if ($scope.password == "") {
			console.log("[ModalController] - no password, returning with username");
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
				console.log("[ModalController] - modal logged in");
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
			console.log("[ModalController] - registered");
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
				console.log("modal: " + data.content);
				console.log("user: " + user);
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
	var log = function(s) {
		return "[MainController] " + s;
	};

	console.log(log("starting"));

	var setDefaults = function() {
		$rootScope.loggedIn = false;
		$rootScope.username = "";
		$rootScope.versionS = "v3.0.0";
		$rootScope.aCookies = 'On';

		var defaultA = Object.keys(artifact_info).map(function(a) { return a + ".0"; }).join();
		var defaultW = Object.keys(hero_info).map(function(w) { return "0"; }).join();
		var defaultL = Object.keys(hero_info).map(function(l) { return "0"; }).join();
		var defaultC = "0,0,0,0,0,0";
		var defaultM = "1,1,1,1,0,0";
		var defaultP = Object.keys(artifact_info).map(function(p) { return "0"; }).join();

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
			0         // 20 - w_toCalculate
		].join("|");

		$scope.loginText = "Login";
		$scope.isCollapsed = false;
	};

	$scope.getSS = function(i) {
		return $rootScope.split("|")[i];
	};

	$scope.updateSS = function(i, value) {
		var t = $rootScope.state.split("|");
		t[i] = value;
		$rootScope.state = t.join("|");
	};

	$scope.saveS = function() {
		console.log(log("storing state to cookies"));
		localStorageService.set('state', $rootScope.state);
	};

	$scope.toggle = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
		localStorageService.set('toggle', $scope.isCollapsed);
	};

	$scope.test = function() {
		console.log(log("testing"));
		$http({
			method: "GET",
			url: "test"
		}).success(function(data, status, headers, config) {
			console.log(log("test succes: " + data.content));
		}).error(function(data, status, headers, config) {
			console.log(log("test failed with error: " + data.content));
		});
		console.log(log("done testing"));
	};

	$scope.logout = function() {
		$http({
			method: "POST",
			url: "logout"
		}).success(function(data, status, headers, config) {
			console.log(log("logged out"));
			$scope.loginText = "Login";
			$rootScope.loggedIn = false;
			$rootScope.username = "";

			// go back to cookies
			var state = localStorageService.get('state');
			if (isNonNull(state)) { $rootScope.state = state; }
			$scope.$broadcast("stateUpdate");
		}).error(function(data, status, headers, config) {
			console.log(log("logout error: " + data.err));
		});
	};

	$scope.login = function() {
		if ($rootScope.loggedIn) {
			// TODO: change this to $scope.amViewing or something
			if ($scope.loginText.indexOf("viewing") > -1) {
				$scope.loginText = "Login";
				// TODO: this is duplicate code, refactor
				$http({
					method: "POST",
					url: "check"
				}).success(function(data, status, headers, config) {
					console.log(log("check successful"));
					var user = data.content;
					if (user != null) {
						console.log(log("am logged in as user: " + user.username));
						$rootScope.loggedIn = true;

						// TODO: change this to $scope.amViewing or something
						if ($scope.loginText.indexOf("viewing") > -1) {
							console.log(log("but we're viewing someone else so ignore"));
						} else {
							$scope.loginText = "Logout (" + user.username + ")";
							$rootScope.username = user.username;

							console.log(log("logged in, getting state for user: " + $rootScope.username));
							$scope.getState($rootScope.username);
						}
					} else {
						console.log(log("not logged in"));
					}

					// force update in other controllers
					console.log(log("broadcasting state update: " + $rootScope.state));
					$scope.$broadcast("stateUpdate");
				}).error(function(data, status, headers, config) {
					console.log(log("check failed with error: " + data.err));
				});
			} else {
				$scope.logout();
			}
		} else {
			if ($scope.loginText.indexOf("viewing") > -1) {
				console.log(log("stop viewing"));
				$scope.loginText = "Login";
				$rootScope.loggedIn = false;
				$rootScope.username = "";

				var cookies = localStorageService.get('autoc');
				if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }

				console.log(log("try to get from cookies"));
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
					console.log(log("result from modal: " + JSON.stringify(info)));
					if (info.loggedIn) {
						if (info.username) {
							console.log(log("is logged in"));
							$rootScope.loggedIn = true;
							$scope.loginText = "Logout (" + info.username + ")";
						}
						if (info.state) {
							console.log(log("has state"));
							$rootScope.state = info.state.state;
							console.log(log("state after login: " + $rootScope.state));
							console.log(log("state after login: " + $rootScope.state.state));
							console.log(log("state after login: " + JSON.stringify($rootScope.state)));
							$scope.$broadcast("stateUpdate");
						}
					} else {
						if (info.username) {
							console.log(log("getting state for non logged in user: " + info.username));
							$scope.viewingUser(info.username);
						}
					}
				}, function () {
					console.log(log("Modal dismissed at: " + new Date()));
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
		console.log(log("http getting state for " + username));
		$http({
			method: "GET",
			url: "state",
			params: {
				"username" : username
			}
		}).success(function(data, status, headers, config) {
			console.log(log("get state success: " + data.content));
			console.log(log(Object.keys(data)));
			$rootScope.state = data.content;
			$scope.$broadcast("stateUpdate");
		}).error(function(data, status, headers, config) {
			console.log(log("get state failed with error: " + data.content));
		});
	};

	$scope.saveState = function() {
		if ($rootScope.loggedIn) {
			console.log(log("is logged in"));
			console.log(log("sending: " + $rootScope.state));
			$http({
				method: "POST",
				url: "state",
				data: {
					"state": $rootScope.state
				}
			}).success(function(data, status, headers, config) {
				console.log(log("state saved"));
				$rootScope.stateSavedSuccessfully = true;
				setTimeout(function() {
					console.log("lakjsldfkj");
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
			console.log(log("is logged in"));
			console.log(log("sending: " + filestring));
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
		console.log(log("window unload, save state"));
		$scope.saveState();
	};

	setDefaults();

	// Get things from cookies
	var toggled = localStorageService.get('toggle');
	if (isNonNull(toggled)) { $scope.isCollapsed = toggled; }

	console.log(log("getting state from cookies"));
	var state = localStorageService.get('state');
	if (isNonNull(state) && state[0] != "v") {
		localStorageService.remove('state');
	} else {
		if (isNonNull(state)) { $rootScope.state = state; }
		console.log(log("got state from cookies"));
	}

	var cookies = localStorageService.get('autoc');
	if (isNonNull(cookies)) { $rootScope.aCookies = cookies; }

	if ("state" in $routeParams) {
		$rootScope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
		// $scope.importFromString($rootScope.state, false);
	}

	console.log(log(JSON.stringify($routeParams)));

	if ("username" in $routeParams) {
		var username = $routeParams.username;
		console.log(log("in params"));
		$scope.getState(username);

		// force update in other controllers
		console.log(log("broadcasting state update: " + $rootScope.state));
		$scope.$broadcast("stateUpdate");
	} else {
		$http({
			method: "POST",
			url: "check"
		}).success(function(data, status, headers, config) {
			console.log(log("check successful"));
			var user = data.content;
			if (user != null) {
				console.log(log("am logged in as user: " + user.username));
				$rootScope.loggedIn = true;

				// TODO: change this to $scope.amViewing or something
				if ($scope.loginText.indexOf("viewing") > -1) {
					console.log(log("but we're viewing someone else so ignore"));
				} else {
					$scope.loginText = "Logout (" + user.username + ")";
					$rootScope.username = user.username;

					console.log(log("logged in, getting state for user: " + $rootScope.username));
					$scope.getState($rootScope.username);
				}
			} else {
				console.log(log("not logged in"));
			}

			// force update in other controllers
			console.log(log("broadcasting state update: " + $rootScope.state));
			$scope.$broadcast("stateUpdate");
		}).error(function(data, status, headers, config) {
			console.log(log("check failed with error: " + data.err));
		});
	}
});