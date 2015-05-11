yattoApp.controller('CalculatorController',
	function($scope, $http, $cookies, $cookieStore, $timeout, $rootScope, localStorageService, usSpinnerService) {
		MathJax.Hub.Configured();
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		$scope.sortableOptions = {
			'ui-floating': false,
			'axis': 'y',
			'containment': "parent",
			'handle': '> .myHandle',
			update: function(e, ui) {
				// TODO: a bit hacky, but seems like the update event is being fired before change to $artifacts is applied?
				$timeout(function() {
					$scope.generateStateString();
				}, 10);
			}
		};

		$scope.spinneractive = false;
		$rootScope.$on('us-spinner:spin', function(event, key) {
	      $scope.spinneractive = true;
	    });

	    $rootScope.$on('us-spinner:stop', function(event, key) {
	      $scope.spinneractive = false;
	    });

		$scope.steps = [];
		$scope.summary_steps = [];
		$("#step-tabs").tabs();

		$scope.stepmessage = "Click calculate to get steps!";

		$scope.artifact_caps = [null, null, 10, null, null, null, 25, 25, null, null, null, null, 10, null, 10, null, 10, 10, null, null, 25, 10, 10, 25, null, null, null, 10, 5];

		var artifact_names = {
			 0 : "Amulet of the Valrunes",
			 1 : "Axe of Resolution",
			 2 : "Barbarian's Mettle",
			 3 : "Chest of Contentment",
			 4 : "Crafter's Elixir",
			 5 : "Crown Egg",
			 6 : "Dark Cloak of Life",
			 7 : "Death Seeker",
			 8 : "Divine Chalice",
			 9 : "Drunken Hammer",
			10 : "Future's Fortune",
			11 : "Hero's Thrust",
			12 : "Hunter's Ointment",
			13 : "Knight's Shield",
			14 : "Laborer's Pendant",
			15 : "Ogre's Gauntlet",
			16 : "Otherworldly Armor",
			17 : "Overseer's Lotion",
			18 : "Parchment of Importance",
			19 : "Ring of Opulence",
			20 : "Ring of Wondrous Charm",
			21 : "Sacred Scroll",
			22 : "Saintly Shield",
			23 : "Savior Shield",
			24 : "Tincture of the Maker",
			25 : "Undead Aura",
			26 : "Universal Fissure",
			27 : "Warrior's Revival",
			28 : "Worldly Illuminator"};

		$scope.artifacts = [];
		for (var a in artifact_names) {
			$scope.artifacts.push({
				name: artifact_names[a],
				index: a,
				value: 0
			});
		}

		var hero_names = {
			 0 : "Takeda the Blade Assassin",
			 1 : "Contessa the Torch Wielder",
			 2 : "Hornetta, Queen of the Valrunes",
			 3 : "Mila the Hammer Stomper",
			 4 : "Terra the Land Scorcher",
			 5 : "Inquisireaux the Terrible",
			 6 : "Charlotte the Special",
			 7 : "Jordaan, Knight of Mini",
			 8 : "Jukka, Master of Axes",
			 9 : "Milo and Clonk-Clonk",
			10 : "Macelord the Ruthless",
			11 : "Gertrude the Goat Rider",
			12 : "Twitterella the Tweeter",
			13 : "Master Hawk, Lord of Luft",
			14 : "Elpha, Wielder of Gems",
			15 : "Poppy, Daughter of Ceremony",
			16 : "Skulptor, Protector of Bridges",
			17 : "Sterling the Enchantor",
			18 : "Orba the Foreseer",
			19 : "Remus the Noble Archer",
			20 : "Mikey the Magician Apprentice",
			21 : "Peter Pricker the Prickly Poker",
			22 : "Teeny Tom, Keeper of the Castle",
			23 : "Deznis the Cleanser",
			24 : "Hamlette, Painter of Skulls",
			25 : "Eistor the Banisher",
			26 : "Flavius and Oinksbjorn",
			27 : "Chester the Beast Tamer",
			28 : "Mohacas the Wind Warrior",
			29 : "Jaqulin the Unknown",
			30 : "Pixie the Rebel Fairy",
			31 : "Jackalope the Fireballer",
			32 : "Dark Lord, Punisher of All"};

		$scope.heroes = [];
		for (var h in hero_names) {
			$scope.heroes.push({
				name: hero_names[h],
				index: h,
				weapons: 1,
				level: 800
			});
		}

		$scope.weapons = [
			{name: "Takeda the Blade Assassin",       index:  0, value: 0},
			{name: "Contessa the Torch Wielder",      index:  1, value: 0},
			{name: "Hornetta, Queen of the Valrunes", index:  2, value: 0},
			{name: "Mila the Hammer Stomper",         index:  3, value: 0},
			{name: "Terra the Land Scorcher",         index:  4, value: 0},
			{name: "Inquisireaux the Terrible",       index:  5, value: 0},
			{name: "Charlotte the Special",           index:  6, value: 0},
			{name: "Jordaan, Knight of Mini",         index:  7, value: 0},
			{name: "Jukka, Master of Axes",           index:  8, value: 0},
			{name: "Milo and Clonk-Clonk",            index:  9, value: 0},
			{name: "Macelord the Ruthless",           index: 10, value: 0},
			{name: "Gertrude the Goat Rider",         index: 11, value: 0},
			{name: "Twitterella the Tweeter",         index: 12, value: 0},
			{name: "Master Hawk, Lord of Luft",       index: 13, value: 0},
			{name: "Elpha, Wielder of Gems",          index: 14, value: 0},
			{name: "Poppy, Daughter of Ceremony",     index: 15, value: 0},
			{name: "Skulptor, Protector of Bridges",  index: 16, value: 0},
			{name: "Sterling the Enchantor",          index: 17, value: 0},
			{name: "Orba the Foreseer",               index: 18, value: 0},
			{name: "Remus the Noble Archer",          index: 19, value: 0},
			{name: "Mikey the Magician Apprentice",   index: 20, value: 0},
			{name: "Peter Pricker the Prickly Poker", index: 21, value: 0},
			{name: "Teeny Tom, Keeper of the Castle", index: 22, value: 0},
			{name: "Deznis the Cleanser",             index: 23, value: 0},
			{name: "Hamlette, Painter of Skulls",     index: 24, value: 0},
			{name: "Eistor the Banisher",             index: 25, value: 0},
			{name: "Flavius and Oinksbjorn",          index: 26, value: 0},
			{name: "Chester the Beast Tamer",         index: 27, value: 0},
			{name: "Mohacas the Wind Warrior",        index: 28, value: 0},
			{name: "Jaqulin the Unknown",             index: 29, value: 0},
			{name: "Pixie the Rebel Fairy",           index: 30, value: 0},
			{name: "Jackalope the Fireballer",        index: 31, value: 0},
			{name: "Dark Lord, Punisher of All",      index: 32, value: 0}];

		$scope.wtotal = 0;
		$scope.wprobability = 0;
		$scope.wnext = 0;
		$scope.wpset = 0;

		$scope.customizations = [
			{name: "All Damage",      index: 0, value: 0, step: 0.01},
			{name: "Critical Damage", index: 1, value: 0, step: 0.01},
			{name: "Gold Dropped",    index: 2, value: 0, step: 0.01},
			{name: "Chest Gold",      index: 3, value: 0, step: 0.01},
			{name: "Critical Chance", index: 4, value: 0, step: 0.005},
			{name: "Tap Damage",      index: 5, value: 0, step: 0.01}];

		$scope.methods = [
			{name: "Gold",          index: 0, value: true, tabname: "Gold"},
			{name: "All Damage",    index: 1, value: true, tabname: "ADmg"},
			{name: "Tap Damage",    index: 2, value: true,  tabname: "TDmg"},
			{name: "Damage Equivalent",    index: 3, value: true,  tabname: "DmgE"},
			{name: "Relics/second (experimental!)", index: 4, value: false, tabname: " R/s "},
			{name: "Stages/second (experimental!)", index: 5, value: false, tabname: " S/s "}];

		$scope.relics = 0;
		$scope.nsteps = 0;
		$scope.greedy = 1;

		var transformScopeArray = function(scopeArray) {
			var newArray = newZeroes(scopeArray.length);
			for (var x in scopeArray) {
				var thing = scopeArray[x];
				newArray[thing.index] = parseFloat(thing.value);
			}
			return newArray;
		};

		var factorials = {};
		var f = 1;
		factorials[0] = 1;
		factorials[1] = 1;
		for (var i = 2; i < 100; i++) {
			f *= i;
			factorials[i] = f;
		}

		var factorial = function(n) {
			//console.log(n + ": " + factorials[n]);
			return factorials[n];
		}

		$scope.updateRelicInfo = function() {
			if ($scope.relicsua == null) {
				$scope.relicsua = 0;
			}
			if ($scope.relicsstage == null) {
				$scope.relicsstage = 0;
			}
			var multiplier = 2 + 0.1 * $scope.relicsua;
			$scope.relicsnext = (Math.floor($scope.relicsstage / 15) + 1) * 15;
			if ($scope.relicsstage < 90) {
				$scope.relicsget = 0;
				$scope.relicsnext = 90;
			} else {
				$scope.relicsget = Math.floor(multiplier * Math.pow(Math.floor($scope.relicsstage/15) - 5, 1.7));
			}
			$scope.relicsatnext = Math.floor(multiplier * Math.pow(Math.floor($scope.relicsnext/15) - 5, 1.7));
		};
		$scope.updateRelicInfo();

		var choose = function(a, b) {
			// console.log(a + " choose " + b);
			if (b > a) {
				// console.log("returning: 0");
				return 0;
			}
			// console.log("returning: " + factorial(a) / (factorial(b) * factorial(a-b)));
			return factorial(a) / (factorial(b) * factorial(a-b));
		}

		var getWeapons = function() {
			return transformScopeArray($scope.heroes.map(function (h) {
				return {index: h.index, value: h.weapons}; }));
		}

		var getLevels = function() {
			return transformScopeArray($scope.heroes.map(function (h) {
				return {index: h.index, value: h.level}; }));
		}

		$scope.updateWeaponInfo = function() {
			$scope.wtotal = $scope.heroes.map(function(h) { return h.weapons; })
				.reduce(function(a, b) { return a + b; });
			var weapons = getWeapons();
			$scope.wprobability = Math.round(calculate_weapons_probability(weapons) * 100000) / 100000;

			var min = weapons[0];
			var nmin = 1;
			for (var i = 1; i < weapons.length; i++) {
				if (weapons[i] == min) {
					nmin += 1;
				} else if (weapons[i] < min) {
					nmin = 1;
					min = weapons[i];
				}
			}
			var toNextSet = nmin;
			$scope.wtonext = toNextSet;
			// console.log("to next set: " + toNextSet);
			var getting = $scope.wnext;
			// console.log("getting: " + getting);
			if (getting < toNextSet) {
				$scope.wpset = 0;
			} else {
				// https://www.reddit.com/r/TapTitans/comments/33smgn/probability_of_completing_a_full_weapon_set_on/
				// p = [Sum_{i=0}^{i=w} (-1)^i * C(33-w,i) * (33-i)^n ] / 33^n
				var summation = 0;
				var w = 33 - toNextSet;
				for (var i = 0; i <= w; i++) {
					// console.log(choose(toNextSet, i));
					// console.log(Math.pow(-1, i));
					// console.log(choose(toNextSet, i));
					// console.log(Math.pow(toNextSet, getting));
					summation += Math.pow(-1, i) * choose(toNextSet, i) * Math.pow(33-i, getting);
					// console.log("summation: " + summation);
				}
				// console.log("num: " + summation);
				// console.log("den: " + Math.pow(33, getting));
				var p = summation / Math.pow(33, getting);
				// console.log("p: " + p);

				$scope.wpset = Math.round(p * 100000) / 100000;
				// TODO: this is wrong
				// y! / ((y-x)! * z^x)

				// what's the probability of picking at least one each of x things in y tries with z options?
				// $scope.wpset = factorials[getting] / (factorials[getting - toNextSet] * Math.pow(33, getting));
				// $scope.wpset = Math.round($scope.wpset * 1000) / 1000.0;
				// var numWays = 1 * Math.pow(33, getting - toNextSet) * factorials[getting];
				// var p = numWays / Math.pow(33, getting);
				// $scope.wpset = p;
			}
			// console.log($scope.wpset);
		};

		var readFromCookies = function() {
			// console.log("reading from cookies");
			var cookie_a = localStorageService.get('artifacts');
			// var cookie_w = localStorageService.get('weapons');
			var cookie_h = localStorageService.get('heroes');
			var cookie_c = localStorageService.get('customizations');
			var cookie_m = localStorageService.get('methods');
			var cookie_s = localStorageService.get('steps');
			var cookie_ss = localStorageService.get('summary');
			if (typeof cookie_a !== "undefined" && cookie_a != null) {
				$scope.artifacts = cookie_a;
			}
			if (typeof cookie_w !== "undefined" && cookie_w != null) {
				$scope.weapons = cookie_w;
			}
			if (typeof cookie_h !== "undefined" && cookie_h != null) {
				$scope.heroes = cookie_h;
			}
			if (typeof cookie_c !== "undefined" && cookie_c != null) {
				$scope.customizations = cookie_c;
			}
			if (typeof cookie_m !== "undefined" && cookie_m != null) {
				$scope.methods = cookie_m;
			}
			if (typeof cookie_s !== "undefined" && cookie_s != null) {
				$scope.steps = cookie_s;
			}
			if (typeof cookie_ss !== "undefined" && cookie_ss != null) {
				$scope.summary_steps = cookie_ss;
			}

			$scope.updateWeaponInfo();
		};

		var storeToCookies = function() {
			localStorageService.set('artifacts', $scope.artifacts);
			// localStorageService.set('weapons', $scope.weapons);
			localStorageService.set('heroes', $scope.heroes);
			localStorageService.set('customizations', $scope.customizations);
			localStorageService.set('methods', $scope.methods);
			localStorageService.set('steps', $scope.steps);
			localStorageService.set('summary', $scope.summary_steps);
		};

		$scope.clearAllCookies = function() {
			localStorageService.clearAll();
		};

		$scope.generateStateString = function() {
			$scope.state = [
				$scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join(),
				$scope.heroes.map(function(h) { return h.level + "." + h.weapons; }).join(),
				// $scope.weapons.map(function(w) { return w.value; }).join(),
				$scope.customizations.map(function(c) { return c.value; }).join(),
				$scope.methods.map(function(m) { return m.value ? 1 : 0; }).join(),
				$scope.relics,
				$scope.nsteps,
				$scope.greedy].join("|");
		};

		$scope.artifactCheck = function(i, ai) {
			if ($scope.artifact_caps[ai] != null &&
					$scope.artifacts[i].value > $scope.artifact_caps[ai]) {
				$scope.artifacts[i].value = $scope.artifact_caps[ai];
			}
			if ($scope.artifacts[i].value == null) {
				$scope.artifacts[i].value = 0;
			}
			$scope.generateStateString();
		};

		$scope.heroesCheck = function(i, ai) {
			if ($scope.heroes[i].level == null) {
				$scope.heroes[i].level = 0;
			}
			if ($scope.heroes[i].weapons == null) {
				$scope.heroes[i].weapons = 0;
			}
			// if ($scope.weapons[i].value == null) {
			// 	$scope.weapons[i].value = 0;
			// }
			$scope.generateStateString();
			$scope.updateWeaponInfo();
		};

		$scope.customizationCheck = function(i, ai) {
			if ($scope.customizations[i].value == null) {
				$scope.customizations[i].value = 0;
			}
			$scope.generateStateString();
		};

		readFromCookies();
		$scope.generateStateString();

		var parseOrZero = function(s, f) {
			var i = f(s);
			if (i == null || isNaN(i)) {
				i = 0;
			}
			return i;
		}

		$scope.importFromString = function(state) {
			var t = state.split("|");
			var artifacts = [];
			t[0].split(",").forEach(function(a, i, array) {
				var v = a.split(".");
				var aindex = parseOrZero(v[0], parseInt);
				var avalue = parseOrZero(v[1], parseInt);
				artifacts.push({
					name: artifact_names[aindex],
					index: aindex,
					value: avalue
				});
			});
			$scope.artifacts = artifacts;
			t[1].split(",").forEach(function(h, i, array) {
				var v = h.split(".");
				var hlevel = parseOrZero(v[0], parseInt);
				var hweapons = parseOrZero(v[1], parseInt);
				$scope.heroes[i].level = hlevel;
				$scope.heroes[i].weapons = hweapons;
				// $scope.weapons[i].value = parseOrZero(w, parseInt);
			});
			t[2].split(",").forEach(function(c, i, array) {
				$scope.customizations[i].value = parseOrZero(c, parseFloat);
			})
			t[3].split(",").forEach(function(m, i, array) {
				$scope.methods[i].value = m == 1 ? true : false;
			})
			$scope.relics = parseOrZero(t[4], parseInt);
			$scope.nsteps = parseOrZero(t[5], parseInt);
			$scope.greedy = parseOrZero(t[6], parseInt);
			$scope.generateStateString();
			storeToCookies();
		};

		// // testing stuff
		var g = new GameState(transformScopeArray($scope.artifacts),
			getWeapons(), getLevels(), transformScopeArray($scope.customizations));
		// console.log(g.next_ff_level());
		// g.get_all_skills();
		console.log(g.gold_multiplier());


		$scope.calculate = function() {
			if ($scope.relics == 0 && $scope.nsteps == 0) {
				$scope.stepmessage = "Get some relics or enter a number of steps!";
				$scope.steps = [];
				$scope.summary_steps = [];
				return;
			}

			var artifacts = transformScopeArray($scope.artifacts);
			if (sumArray(artifacts) == 0) {
				$scope.stepmessage = "Buy a new artifact!";
				$scope.steps = [];
				$scope.summary_steps = [];
				return;
			}

			if (!$scope.spinneractive) {
				console.log("starting spinner");
				usSpinnerService.spin('spinner');
			}

			var weapons = getWeapons();
			var levels = getLevels();
			var customizations = transformScopeArray($scope.customizations);
			var methods = [];
			for (var m in $scope.methods) {
				if ($scope.methods[m].value) {
					methods.push($scope.methods[m].index);
				}
			}

			var response;
			$timeout(function() {
				response = get_steps(artifacts, weapons, levels, customizations, methods, $scope.relics, $scope.nsteps, $scope.greedy);

				$scope.$apply(function() {
					for (var m in response) {
						$scope.steps[m] = response[m]["steps"];
						$scope.summary_steps[m] = response[m]["summary"];
					}

					storeToCookies();
					if ($scope.spinneractive) {
						usSpinnerService.stop('spinner');
					}
				});
			}, 0);
		};

		$scope.resetSteps = function() {
			$scope.stepmessage = "Click calculate to get steps!";
			$scope.steps = [];
			$scope.summary_steps = [];
			localStorageService.remove('steps');
			localStorageService.remove('summary');
		};

		// $scope.weaponProbability = function() {
		// 	var weapons = transformScopeArray($scope.weapons);
		// 	$scope.wprobability = calculate_weapons_probability(weapons);
		// };

		$scope.step = function(summary, method, stepindex) {
			var step = summary ? $scope.summary_steps[method][stepindex] : $scope.steps[method][stepindex];

			var cost = step.cost;
			if (summary) {
				$scope.summary_steps[method].splice(stepindex, 1);
				var toDelete = [];
				for (var s in $scope.steps[method]) {
					if ($scope.steps[method][s].index == step.index) {
						toDelete.push(s);
					}
				}
				toDelete.reverse();
				for (var i in toDelete) {
					$scope.steps[method].splice(toDelete[i], 1);
				}
			} else {
				$scope.steps[method].splice(stepindex, 1);
				// delete from ss
				for (var ss in $scope.summary_steps[method]) {
					var sstep = $scope.summary_steps[method][ss];
					if (sstep.index == step.index && sstep.level == step.level) {
						$scope.summary_steps[method].splice(ss, 1);
						break;
					}
				}

				// delete from s
				var toDelete = [];
				for (var s in $scope.steps[method]) {
					if (s >= stepindex) {
						break;
					}
					if ($scope.steps[method][s].index == step.index) {
						toDelete.push(s);
						cost += $scope.steps[method][s].cost;
					}
				}
				toDelete.reverse();
				for (var i in toDelete) {
					$scope.steps[method].splice(toDelete[i], 1);
				}
			}

			var total = 0;
			for (var s in $scope.steps[method]) {
				total += $scope.steps[method][s].cost;
				$scope.steps[method][s].cumulative = total;
			}

			// if step, go through summary and delete from cost
			// if summary step is here, hasn't been deleted
			if (!summary) {
				for (var ss in $scope.summary_steps[method]) {
					var sstep = $scope.summary_steps[method][ss];
					if (sstep.index == step.index) {
						$scope.summary_steps[method][ss].value -= cost;
					}
				}
			}

			for (var a in $scope.artifacts) {
				var artifact = $scope.artifacts[a];
				if (artifact.index == step.index) {
					artifact.value = step.level;
					$scope.relics -= cost;
					break;
				}
			}
			$scope.relics = Math.max($scope.relics, 0);

			// TODO: impact on other methods (grey out?)

			storeToCookies();
		};

	}
);