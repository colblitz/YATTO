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

		var setDefaults = function() {
			$scope.artifacts = [];
			for (var a in artifact_names) {
				$scope.artifacts.push({
					name: artifact_names[a],
					index: a,
					value: 0
				});
			}

			$scope.heroes = [];
			for (var h in hero_names) {
				$scope.heroes.push({
					name: hero_names[h],
					index: h,
					weapons: 0,
					level: 800
				});
			}

			$scope.customizations = [
				{name: "All Damage",      index: 0, value: 0, step: 0.01},
				{name: "Critical Damage", index: 1, value: 0, step: 0.01},
				{name: "Gold Dropped",    index: 2, value: 0, step: 0.01},
				{name: "Chest Gold",      index: 3, value: 0, step: 0.01},
				{name: "Critical Hit",    index: 4, value: 0, step: 0.005},
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

			$scope.w_chiprob = 0;
			$scope.w_totalwp = 0;
			$scope.w_tonexts = 0;
			$scope.w_getting = 0;
			$scope.w_probset = 0;

			$scope.r_cstage = 0;
			$scope.r_undead = 0;
			$scope.r_levels = 0;
			$scope.r_nextbp = 0;
			$scope.r_reward = 0;
			$scope.r_atnext = 0;

			$scope.autocookies = 'On';
			$scope.generateStateString();
		};

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
			return factorials[n];
		};

		var choose = function(a, b) {
			if (b > a) {
				return 0;
			}
			return factorial(a) / (factorial(b) * factorial(a-b));
		};

		var getWeapons = function() {
			return transformScopeArray($scope.heroes.map(function (h) {
				return {index: h.index, value: h.weapons}; }));
		};

		var getLevels = function() {
			return transformScopeArray($scope.heroes.map(function (h) {
				return {index: h.index, value: h.level}; }));
		};

		var hasCookie = function(cookie) {
			return (typeof cookie !== "undefined" && cookie != null);
		};

		$scope.readFromCookies = function() {
			var cookie_state = localStorageService.get('state');
			var cookie_steps = localStorageService.get('steps');
			var cookie_summs = localStorageService.get('summs');
			var cookie_autoc = localStorageService.get('autoc');

			if (hasCookie(cookie_state)) { $scope.state = cookie_state; }
			if (hasCookie(cookie_steps)) { $scope.steps = cookie_steps; }
			if (hasCookie(cookie_summs)) { $scope.summary_steps = cookie_summs; }
			if (hasCookie(cookie_autoc)) { $scope.autocookies = cookie_autoc; }

			$scope.importFromString($scope.state);
		};

		$scope.storeToCookies = function() {
			localStorageService.set('state', $scope.state);
			localStorageService.set('steps', $scope.steps);
			localStorageService.set('summs', $scope.summary_steps);
			localStorageService.set('autoc', $scope.autocookies);
		};

		$scope.updateCookies = function() {
			if ($scope.autocookies == 'On') {
				$scope.storeToCookies();
			} else {
				localStorageService.set('autoc', $scope.autocookies);
			}
		};

		$scope.clearAllCookies = function() {
			localStorageService.clearAll();
		};

		$scope.updateRelicInfo = function() {
			var uaMultiplier = 1 + 0.05 * $scope.r_undead;

			// ua 255, levels 33432 --> 461
			// ua 255, levels 33605 --> 463

			// var h1 = Math.ceil($scope.r_levels / 1000);
			// var h2 = ($scope.r_levels + 600)/ 1000;
			// var h3 = Math.floor(h1);
			// var h4 = Math.floor(h2);
			// var h5 = Math.round(h1);
			// var h6 = Math.round(h2);
			// var h7 = Math.ceil(h1);
			// var h8 = Math.ceil(h2);

			// var hr1 = h1 * uaMultiplier;
			// var hr2 = h2 * uaMultiplier;
			// var hr3 = h3 * uaMultiplier;
			// var hr4 = h4 * uaMultiplier;
			// var hr5 = h5 * uaMultiplier;
			// var hr6 = h6 * uaMultiplier;
			// var hr7 = h7 * uaMultiplier;
			// var hr8 = h8 * uaMultiplier;
			// var hr9 = $scope.r_levels * uaMultiplier;
			// var hr10 = ($scope.r_levels + 600) * uaMultiplier;

			// console.log("---------------");
			// console.log(hr1);
			// console.log(hr2);
			// console.log(hr3);
			// console.log(hr4);
			// console.log(hr5);
			// console.log(hr6);
			// console.log(hr7);
			// console.log(hr8);
			// console.log(hr9);
			// console.log(hr10);

			var heroRelics = $scope.r_levels / 1000;
			var stageRelics = Math.pow(Math.floor($scope.r_cstage/15) - 5, 1.7);

			heroRelics = Math.ceil(heroRelics * uaMultiplier);
			stageRelics = Math.ceil(stageRelics * uaMultiplier);

			$scope.r_nextbp = (Math.floor($scope.r_cstage / 15) + 1) * 15;
			if ($scope.r_cstage < 90) {
				$scope.r_reward = 0;
				$scope.r_nextbp = 90;
			} else {
				$scope.r_reward = Math.round(2 * (stageRelics + heroRelics));
			}
			stageRelics = Math.pow(Math.floor($scope.r_nextbp/15) - 5, 1.7);
			stageRelics = Math.ceil(stageRelics * uaMultiplier);
			$scope.r_atnext = Math.round(2 * (stageRelics + heroRelics));
		};

		$scope.updateWeaponInfo = function() {
			var weapons = getWeapons();
			$scope.w_totalwp = weapons.reduce(function(a, b) { return a + b; });
			$scope.w_chiprob = Math.round(calculate_weapons_probability(weapons) * 100000) / 100000;

			var min = weapons[0];
			var toNextSet = 1;
			for (var i = 1; i < weapons.length; i++) {
				if (weapons[i] == min) {
					toNextSet += 1;
				} else if (weapons[i] < min) {
					toNextSet = 1;
					min = weapons[i];
				}
			}
			$scope.w_tonexts = toNextSet;
			var getting = $scope.w_getting;
			if (getting < toNextSet) {
				$scope.w_probset = 0;
			} else {
				// https://www.reddit.com/r/TapTitans/comments/33smgn/probability_of_completing_a_full_weapon_set_on/
				// p = [Sum_{i=0}^{i=w} (-1)^i * C(33-w,i) * (33-i)^n ] / 33^n
				var summation = 0;
				var w = 33 - toNextSet;
				for (var i = 0; i <= w; i++) {
					summation += Math.pow(-1, i) * choose(toNextSet, i) * Math.pow(33-i, getting);
				}
				var p = summation / Math.pow(33, getting);
				$scope.w_probset = Math.round(p * 100000) / 100000;
			}
		};

		$scope.generateStateString = function() {
			$scope.state = [
				$scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join(),
				$scope.heroes.map(function(h) { return h.level + "." + h.weapons; }).join(),
				$scope.customizations.map(function(c) { return c.value; }).join(),
				$scope.methods.map(function(m) { return m.value ? 1 : 0; }).join(),
				$scope.relics,
				$scope.nsteps,
				$scope.greedy,
				$scope.w_getting,
				$scope.r_cstage,
				$scope.r_undead,
				$scope.r_levels].join("|");
		};

		$scope.stateChanged = function() {
			// re-generate state
			$scope.generateStateString();

			// store state to cookies
			$scope.updateCookies();

			// recalculate things
			$scope.updateRelicInfo();
			$scope.updateWeaponInfo();
		};

		var parseOrZero = function(s, f) {
			var i = f(s);
			if (i == null || isNaN(i)) {
				i = 0;
			}
			return i;
		};

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
			$scope.relics    = parseOrZero(t[4], parseInt);
			$scope.nsteps    = parseOrZero(t[5], parseInt);
			$scope.greedy    = parseOrZero(t[6], parseInt);
			$scope.w_getting = parseOrZero(t[7], parseInt);
			$scope.r_cstage  = parseOrZero(t[8], parseInt);
			$scope.r_undead  = parseOrZero(t[9], parseInt);
			$scope.r_levels  = parseOrZero(t[10], parseInt);

			$scope.stateChanged();
		};

		$scope.artifactCheck = function(i, ai) {
			if ($scope.artifact_caps[ai] != null &&
					$scope.artifacts[i].value > $scope.artifact_caps[ai]) {
				$scope.artifacts[i].value = $scope.artifact_caps[ai];
			}
			if ($scope.artifacts[i].value == null) {
				$scope.artifacts[i].value = 0;
			}
			$scope.stateChanged();
		};

		$scope.heroesCheck = function(i, ai) {
			if ($scope.heroes[i].level == null) {
				$scope.heroes[i].level = 0;
			}
			if ($scope.heroes[i].weapons == null) {
				$scope.heroes[i].weapons = 0;
			}
			$scope.stateChanged();
		};

		$scope.customizationCheck = function(i, ai) {
			// $scope.generateStateString();
		};

		// // testing stuff
		// var g = new GameState(transformScopeArray($scope.artifacts),
		// 	getWeapons(), getLevels(), transformScopeArray($scope.customizations));
		// // console.log(g.next_ff_level());
		// // g.get_all_skills();
		// console.log(g.gold_multiplier());

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

					$scope.updateCookies();
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
			udpateCookies();
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

			$scope.updateCookies();
		};

		// initialize
		setDefaults();
		$scope.readFromCookies();
		$scope.generateStateString();
		$scope.updateRelicInfo();
		$scope.updateWeaponInfo();
	}
);