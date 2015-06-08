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


yattoApp.controller('FaqController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

yattoApp.controller('FormulasController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

// yattoApp.filter('slice', function() {
//   return function(arr, start, end) {
//     return arr.slice(start, end);
//   };
// });

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
	// var subtraction = (s == MMIN) ? MMAX : Math.abs(s);
	// mj = MSEED - subtraction;
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
			// this.seedArray[i] -= this.seedArray[1 + (i + 30) % 55];
			this.seedArray[i] -= this.seedArray[1 + ((i + 30) % 55)];
			if (this.seedArray[i] < 0) { this.seedArray[i] += MMAX; }
		}
	}
	this.inext = 0;
	// this.inextp = 21;
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

		// if (range <= MMAX) {
		// 	console.log("lkajlskjdf");
		// 	// convert from double to int
		// 	return Math.floor(this.sample() * range) + minValue;
		// } else {
		// 	console.log("big");
		// 	return Math.floor(this.getSampleForLargeRange() * range) + minValue;
		// }
	};

	// returns double
	this.sample = function() {
		// return this.internalSample() * (1.0 / MMAX);
		if (++this.inext >= 56) { this.inext = 1; }
		if (++this.inextp >= 56) { this.inextp = 1; }
		var num = this.seedArray[this.inext] - this.seedArray[this.inextp];
		if (num < 0) { num += MMAX; }
		this.seedArray[this.inext] = num;
		return (num * 4.6566128752457969E-10);
	};

	// returns double
	// this.getSampleForLargeRange = function() {
	// 	var result = this.internalSample();
	// 	var negative = (this.internalSample() % 2) == 0 ? true : false;
	// 	if (negative) {
	// 		result = -result;
	// 	}
	// 	var d = result;
	// 	d += MMAX - 1;
	// 	d /= 2*MMAX - 1;
	// 	return d;
	// };

	// returns int
	// this.internalSample = function() {
	// 	var retVal;
	// 	var locINext = this.inext;
	// 	var locINextp = this.inextp;

	// 	if (++locINext >= 56) { locINext = 1; }
	// 	if (++locINextp >= 56) { locINextp = 1; }

	// 	retVal = this.seedArray[locINext] - this.seedArray[locINextp];

	// 	if (retVal == MMAX) { retVal --; }
	// 	if (retVal < 0) { retVal += MMAX; }

	// 	this.seedArray[locINext] = retVal;

	// 	this.inext = locINext;
	// 	this.inextp = locINextp;

	// 	return retVal;
	// };
}


// random = new Random(1911545348);
// var string = "";
// string += "1911545348";
// string += ",";
// string += random.next(1, 2147483647).toString();
// string += ",";
// string += random.next(1, 34).toString();
// console.log(string);


// for (var s = 0; s < 1000; s++) {
// 	var random = new Random(s);
// 	var string = "";
// 	string += s.toString();
// 	string += ",";
// 	string += random.next(1, 2147483647).toString();
// 	string += ",";
// 	string += random.next(1, 34).toString();
// 	console.log(string);
// }