/* App Module */
var yattoApp = angular.module('yattoApp', [
	'ngRoute', 'ngCookies', 'ngRepeatReorder', 'ui.sortable', 'ui.bootstrap', 'LocalStorageModule', 'angularSpinner'
]);

yattoApp.service('shareVariables', function () {
	var variables = {};
	return {
		getVariable: function(k) {
			return variables[k];
		},
		setVariable: function(k, v) {
			variables[k] = v;
		},
		hasVariable: function(k) {
			return k in variables;
		}
	};
});

yattoApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/calculator.html',
				controller: 'CalculatorController'
			}).
			when('/calculator', {
				templateUrl: 'partials/calculator.html',
				controller: 'CalculatorController'
			}).
			when('/faq', {
				templateUrl: 'partials/faq.html',
				controller: 'FaqController'
			}).
			when('/reference', {
				templateUrl: 'partials/reference.html',
				controller: 'ReferenceController'
			}).
			when('/formulas', {
				templateUrl: 'partials/formulas.html',
				controller: 'FormulasController'
			}).
			when('/sequencer', {
				templateUrl: 'partials/sequencer.html',
				controller: 'SequencerController'
			}).
			otherwise({
				templateUrl: 'partials/calculator.html',
				controller: 'CalculatorController'
			});
	}
]);

yattoApp.directive("fileread", [function () {
	return {
		scope: {
			fileread: "="
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.fileread = loadEvent.target.result;
					});
				}
				console.log("lakjsldkjflakjsldf");
				if (changeEvent.target.files[0].name.split(".").pop() == "adat") {
					reader.readAsText(changeEvent.target.files[0]);
				} else {
					// TODO: display error
				}
			});
		}
	}
}]);

yattoApp.directive('reddit', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: { user : '@' },
		controller: function($scope) {},
		template: '<a href="http://www.reddit.com/user/{{user}}">/u/{{user}}</a>'
	};
});

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

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
			console.log("logged in");
			var user = data.content;
			$rootScope.loggedIn = true;
			$modalInstance.close({username: user.username, state: user.state});
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
			$rootScope.state = user.state;
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
	$rootScope.loggedIn = false;
	$rootScope.versionS = "v3.0.0";

	$rootScope.state = [
		$rootScope.versionS,
		"", //  1 - artifacts
		"", //  2 - weapons
		"", //  3 - levels
		"", //  4 - customizations
		"", //  5 - methods
		"", //  6 - relics
		"", //  7 - nsteps
		"", //  8 - w_getting
		"", //  9 - r_cstage
		"", // 10 - r_undead
		"", // 12 - r_levels
		"", // 13 - active
		"", // 14 - critss
		"", // 15 - zerker
		"", // 16 - a_currentSeed
		"", // 17 - a_aPriorities
		"", // 18 - a_maxDiamonds
		"", // 19 - w_currentSeed
		""  // 20 - w_toCalculate
	].join("|");

	$scope.loginText = "Login";

	$scope.isCollapsed = false;
	var toggled = localStorageService.get('toggle');
	if (isNonNull(toggled)) { $scope.isCollapsed = toggled; }

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
	}

	$scope.logout = function() {
		$http({
			method: "POST",
			url: "logout"
		}).success(function(data, status, headers, config) {
			console.log("logged out");
			$scope.loginText = "Login";
			$rootScope.loggedIn = false;
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

					$scope.loginText = "Logout (" + info.username + ")";
					$scope.$broadcast("stateUpdate");
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		}
	};




	// initialize, check
	$http({
		method: "POST",
		url: "check"
	}).success(function(data, status, headers, config) {
		var user = data.content;
		if (user != null) {
			$scope.loginText = "Logout (" + user.username + ")";
			$rootScope.loggedIn = true;
		}
	}).error(function(data, status, headers, config) {
		console.log("check failed with error: " + data.err);
	});

	// if logged in, get state of user

	// if user route param, get state of user
	if ("username" in $routeParams) {
		var username = $routeParams.username;

		// get state of user
		alsdjfljasdf

		if (got state) {
			// logout
			$scope.logout();
			$scope.loginText = "Viewing (" + username + ")";
			// update rootScope
		}







			$rootScope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
			$scope.importFromString($rootScope.state, false);
		}
	}


});

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

yattoApp.controller('FaqController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

yattoApp.controller('FormulasController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

var unityRandom = [];

var processData = function(data) {
	for (var i in data) {
		unityRandom.push({
			nextSeed: parseInt(data[i][1]),
			values: data[i].slice(2).map(Number)
		});
	}
};

$.ajax({
	url: "../artifact_order_public - Random.csv",
	async: false,
	dataType: "text",
	success: function(data) {
		processData($.csv2Array(data));
	}
});

var isNonNull = function(thing) {
	return typeof thing !== "undefined" && thing != null;
};

/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
var occurrences = function(string, subString, allowOverlapping){
	string+=""; subString+="";
	if(subString.length<=0) return string.length+1;

	var n=0, pos=0;
	var step=(allowOverlapping)?(1):(subString.length);

	while(true){
			pos=string.indexOf(subString,pos);
			if(pos>=0){ n++; pos+=step; } else break;
	}
	return(n);
};

var parseOrZero = function(s, f) {
	var i = f(s);
	if (i == null || isNaN(i)) {
		i = 0;
	}
	return i;
};


var MMAX = 2147483647;
var MMIN = -2147483648;
var MSEED = 161803398;

var newZeroes = function(length) {
	return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

var Random = function(s) {
	var ii;
	var mj, mk;

	this.seedArray = newZeroes(56);
	mj = MSEED - Math.abs(s);
	this.seedArray[55] = mj;
	mk = 1;
	for (var i = 1; i < 55; i++) {
		ii = (21 * i) % 55;
		this.seedArray[ii] = mk;
		mk = mj - mk;
		if (mk < 0) { mk += MMAX; }
		mj = this.seedArray[ii];
	}
	for (var k = 1; k < 5; k++) {
		for (var i = 1; i < 56; i++) {
			this.seedArray[i] -= this.seedArray[1 + ((i + 30) % 55)];
			if (this.seedArray[i] < 0) { this.seedArray[i] += MMAX; }
		}
	}
	this.inext = 0;
	this.inextp = 31;

	this.next = function(minValue, maxValue) {
		if (minValue > maxValue) {
			// error, blakhskd jfhkajesh f
		}
		var range = maxValue - minValue;
		if (range <= 1) {
			return minValue;
		}
		return Math.floor(this.sample() * range) + minValue;
	};

	// returns double
	this.sample = function() {
		if (++this.inext >= 56) { this.inext = 1; }
		if (++this.inextp >= 56) { this.inextp = 1; }
		var num = this.seedArray[this.inext] - this.seedArray[this.inextp];
		if (num < 0) { num += MMAX; }
		this.seedArray[this.inext] = num;
		return (num * 4.6566128752457969E-10);
	};
}