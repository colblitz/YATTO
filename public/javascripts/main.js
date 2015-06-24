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

yattoApp.controller('FaqController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

yattoApp.controller('FormulasController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

// --------------------------------------------------------------------------------------------------------------
// ----- TT Constants -------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

var getOrderList = function() {
	return [
		13, // Knight's Shield
		 0, // Amulet of the Valrunes
		 6, // Dark Cloak of Life
		 7, // Death Seeker
		23, // Savior Shield
		17, // Overseer's Lotion
		21, // Sacred Scroll
		12, // Hunter's Ointment
		14, // Laborer's Pendant
		 2, // Barbarian's Mettle
		22, // Saintly Shield
		15, // Ogre's Gauntlet
		18, // Parchment of Importance
		26, // Universal Fissure
		19, // Ring of Opulence
		 1, // Axe of Resolution
		11, // Hero's Thrust
		 5, // Crown Egg
		 3, // Chest of Contentment
		10, // Future's Fortune
		 8, // Divine Chalice
		25, // Undead Aura
		27, // Warrior's Revival
		20, // Ring of Wondrous Charm
		28, // Worldly Illuminator
		24, // Tincture of the Maker
		 4, // Crafter's Elixir
		16, // Otherworldly Armor
		 9  // Drunken Hammer
		];
};

var customizationValues = {
	// gold dropped
	"0_0" : 0,
	"0_14" : 0.05,
	"0_2" : 0.05,
	"0_3" : 0.05,
	"0_6" : 0.05,
	"0_1" : 0.05,
	"0_8" : 0.1,
	"0_9" : 0.13,
	"0_10" : 0.06,
	"0_13" : 0.07,
	"0_11" : 0.05,
	// crit damage
	"1_0" : 0,
	"1_9" : 0.03,
	"1_1" : 0.05,
	"1_3" : 0.07,
	"1_2" : 0.1,
	"1_8" : 0.01,
	"1_4" : 0.04,
	"1_5" : 0.04,
	"1_6" : 0.19,
	"1_7" : 0.22,
	"1_10" : 0.06,
	// crit chance
	"2_0" : 0,
	"2_3" : 0.005,
	"2_1" : 0.005,
	"2_2" : 0.005,
	"2_4" : 0.005,
	"2_6" : 0.005,
	"2_14" : 0.005,
	"2_13" : 0.01,
	"2_8" : 0.005,
	"2_9" : 0.01,
	"2_11" : 0.03,
	"2_12" : 0.005,
	"2_17" :  0.01,
	"2_16" : 0.01,
	// all damage
	"3_0" : 0,
	"3_901" : 0.02,
	"3_902" : 0.02,
	"3_903" : 0.03,
	"3_904" : 0.03,
	"3_905" : 0.04,
	"3_906" : 0.04,
	"3_907" : 0.05,
	"3_19" : 0.05,
	"3_3" : 0.06,
	"3_4" : 0.06,
	"3_29" : 0.07,
	"3_30" : 0.06,
	"3_26" : 0.03,
	"3_1" : 0.01,
	"3_13" : 0.09,
	"3_5" : 0.05,
	"3_15" : 0.01,
	"3_20" : 0.02,
	"3_14" : 0.05,
	"3_7" : 0.08,
	// tap damage
	"4_0" : 0,
	"4_1" : 0.04,
	"4_2" : 0.04,
	"4_3" : 0.04,
	"4_4" : 0.04,
	"4_5" : 0.04,
	"4_6" : 0.06,
	"4_7" : 0.02,
	"4_8" : 0.08,
	"4_9" : 0.02,
	"4_10" : 0.06,
	// chest gold
	"5_0" : 0,
	"5_1" : 0.05,
	"5_2" : 0.07,
	"5_3" : 0.1,
	"5_5" : 0.1,
	"5_8" : 0.1,
	"5_6" : 0.5,
	"5_7" : 0.15,
	"5_9" : 0.4,
	"5_10": 0.2
};

var heroToName = {
	 1: "Takeda",
	 2: "Contessa",
	 3: "Hornetta",
	 4: "Mila",
	 5: "Terra",
	 6: "Inquisireaux",
	 7: "Charlotte",
	 8: "Jordaan",
	 9: "Jukka",
	10: "Milo",
	11: "Macelord",
	12: "Gertrude",
	13: "Twitterella",
	14: "Master Hawk",
	15: "Elpha",
	16: "Poppy",
	17: "Skulptor",
	18: "Sterling",
	19: "Orba",
	20: "Remus",
	21: "Mikey",
	22: "Peter",
	23: "Teeny Tom",
	24: "Deznis",
	25: "Hamlette",
	26: "Eistor",
	27: "Flavius",
	28: "Chester",
	29: "Mohacas",
	30: "Jaqulin",
	31: "Pixie",
	32: "Jackalope",
	33: "Dark Lord"
};

// --------------------------------------------------------------------------------------------------------------
// ----- Stuff for Random ---------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

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

var MMAX = 2147483647;
var MMIN = -2147483648;
var MSEED = 161803398;

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

// --------------------------------------------------------------------------------------------------------------
// ----- Utility ------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

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

var newZeroes = function(length) {
	return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

