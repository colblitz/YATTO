yattoApp.controller('ModalController', function ($scope, $rootScope, $http, $modalInstance) {
	$scope.username = "";
	$scope.password = "";

	$scope.login = function() {
		// do login
		$http({
			method: "POST",
			url: "login",
			data: {
				"username": $scope.username,
				"password": $scope.password
			}
		}).success(function(data, status, headers, config) {
			console.log("modal logged in");
			$modalInstance.close({username: data.content.username, state: data.content.state});
		}).error(function(data, status, headers, config) {
			$scope.message = data.err;
		});
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
			console.log("registered");
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
				console.log("state saved");
			}).error(function(data, status, headers, config) {
				console.log("error saving state: " + data);
			});

			$modalInstance.close({username: user.username});
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

yattoApp.controller('MainController', function($scope, $rootScope, $http, $modal, $routeParams, localStorageService, shareVariables) {
	console.log("main controller");

	$scope.setDefaults = function() {
		$rootScope.loggedIn = false;
		$rootScope.username = "";
		$rootScope.versionS = "v3.0.0";

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

		console.log($rootScope.state);

		$scope.loginText = "Login";
		$scope.isCollapsed = false;
	}

	$scope.getSS = function(i) {
		return $rootScope.split("|")[i];
	};

	$scope.toggle = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
		localStorageService.set('toggle', $scope.isCollapsed);
	};

	$scope.test = function() {
		console.log("testing");
		$http({
			method: "GET",
			url: "test"
		}).success(function(data, status, headers, config) {
			console.log("test succes: " + data.content);
		}).error(function(data, status, headers, config) {
			console.log("test failed with error: " + data.content);
		});
		console.log("done testing");
	};

	$scope.logout = function() {
		$http({
			method: "POST",
			url: "logout"
		}).success(function(data, status, headers, config) {
			console.log("logged out");
			$scope.loginText = "Login";
			$rootScope.loggedIn = false;
			$rootScope.username = "";
		}).error(function(data, status, headers, config) {
			console.log("logout error: " + data.err);
		});
	};

	$scope.login = function() {
		if ($rootScope.loggedIn) {
			$scope.logout();
		} else {
			var modalInstance = $modal.open({
				templateUrl: 'loginModal.html',
				controller: 'ModalController',
				size: 'sm',
				resolve: {}
			});

			modalInstance.result.then(function (info) {
				console.log("result from modal: " + info.username + " " + info.state);
				if (info.username) {
					console.log("yay stuff after modal: " + info);

					$rootScope.loggedIn = true;
					$rootScope.state = info.state;
					$scope.loginText = "Logout (" + info.username + ")";
					$scope.$broadcast("stateUpdate");
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		}
	};

	$scope.getState = function(username) {
		console.log("http getting state for " + username);
		$http({
			method: "GET",
			url: "state",
			params: {
				"username" : username
			}
		}).success(function(data, status, headers, config) {
			console.log("get state success: " + data.content);
		}).error(function(data, status, headers, config) {
			console.log("get state failed with error: " + data.content);
		});
		console.log("done testing");
	};

	$scope.setDefaults();

	// Get things from cookies
	var toggled = localStorageService.get('toggle');
	if (isNonNull(toggled)) { $scope.isCollapsed = toggled; }

	var state = localStorageService.get('state');
	if (isNonNull(state)) { $rootScope.state = state; }


// if ("state" in $routeParams) {
// 			$rootScope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
// 			$scope.importFromString($rootScope.state, false);
// 		}

	if ("username" in $routeParams) {
		var username = $routeParams.username;
		$scope.getState(username);
	} else {
		$http({
			method: "POST",
			url: "check"
		}).success(function(data, status, headers, config) {
			console.log("check successful");
			var user = data.content;
			if (user != null) {
				console.log("user: " + user.username);
				$scope.loginText = "Logout (" + user.username + ")";
				$rootScope.loggedIn = true;
				$rootScope.username = user.username;

				console.log("logged in, getting state for user: " + $rootScope.username);
				$scope.getState($rootScope.username);
			}
		}).error(function(data, status, headers, config) {
			console.log("check failed with error: " + data.err);
		});
	}
});