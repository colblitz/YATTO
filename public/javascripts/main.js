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

yattoApp.controller('MainController', function(localStorageService) {
	var mc = this;

	mc.isCollapsed = false;
	var toggled = localStorageService.get('toggle');
	if (typeof toggled !== "undefined" && toggled != null) { mc.isCollapsed = toggled; }

	mc.toggle = function() {
		mc.isCollapsed = !mc.isCollapsed;
		localStorageService.set('toggle', mc.isCollapsed);
	};
});

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