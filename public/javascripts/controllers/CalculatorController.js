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
		factorials[0] = 0;
		factorials[1] = 1;
		for (var i = 2; i < 100; i++) {
			f *= i;
			factorials[i] = f;
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
				$scope.relics = 0;
				$scope.relicsnext = 90;
			} else {
				$scope.relics = Math.floor(multiplier * Math.pow(Math.floor($scope.relicsstage/15) - 5, 1.7));
			}
			$scope.relicsatnext = Math.floor(multiplier * Math.pow(Math.floor($scope.relicsnext/15) - 5, 1.7));
		};
		$scope.updateRelicInfo();

		$scope.updateWeaponInfo = function() {
			$scope.wtotal = $scope.weapons.map(function(w) { return w.value; })
				.reduce(function(a, b) { return a + b; });
			var weapons = transformScopeArray($scope.weapons);
			$scope.wprobability = calculate_weapons_probability(weapons);

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
			console.log("to next set: " + toNextSet);
			var getting = $scope.wnext;
			console.log("getting: " + getting);
			if (getting < toNextSet) {
				$scope.wpset = 0;
			} else {
				console.log(factorials[getting]);
				// TODO: this is wrong
				var numWays = 1 * Math.pow(33, getting - toNextSet) * factorials[getting];
				var p = numWays / Math.pow(33, getting);
				$scope.wpset = p;
			}
			console.log($scope.wpset);
		};

		var readFromCookies = function() {
			// console.log("reading from cookies");
			var cookie_a = localStorageService.get('artifacts');
			var cookie_w = localStorageService.get('weapons');
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
			localStorageService.set('weapons', $scope.weapons);
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
				$scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join(","),
				$scope.weapons.map(function(w) { return w.value; }).join(),
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

		$scope.weaponCheck = function(i, ai) {
			if ($scope.weapons[i].value == null) {
				$scope.weapons[i].value = 0;
			}
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
			t[1].split(",").forEach(function(w, i, array) {
				$scope.weapons[i].value = parseOrZero(w, parseInt);
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
		// var g = new GameState(transformScopeArray($scope.artifacts), 
		// 	transformScopeArray($scope.weapons), transformScopeArray($scope.customizations));
		// console.log(g.next_ff_level());

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
				usSpinnerService.spin('spinner');
			}

			var weapons = transformScopeArray($scope.weapons);
			var customizations = transformScopeArray($scope.customizations);
			var methods = [];
			for (var m in $scope.methods) {
				if ($scope.methods[m].value) {
					methods.push($scope.methods[m].index);
				}
			}

			var response;
			$timeout(function() {
				response = get_steps(artifacts, weapons, customizations, methods, $scope.relics, $scope.nsteps, $scope.greedy);

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

		$scope.weaponProbability = function() {
			var weapons = transformScopeArray($scope.weapons);
			$scope.wprobability = calculate_weapons_probability(weapons);
		};

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