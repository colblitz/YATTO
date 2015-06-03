yattoApp.controller('CalculatorController',
	function($scope, $http, $cookies, $cookieStore, $timeout, $rootScope, $routeParams, localStorageService, usSpinnerService, shareVariables) {
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
					$scope.stateChanged(true);
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

		var setDefaults = function() {
			$scope.artifacts = [];
			for (var a in artifact_info) {
				$scope.artifacts.push({
					name: artifact_info[a].name,
					index: a,
					value: 0
				});
			}

			$scope.heroes = [];
			for (var h in hero_info) {
				$scope.heroes.push({
					name: hero_info[h].name,
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

			$scope.all_damage = 0;
			$scope.tap_damage = 0;

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

			$scope.importFromString($scope.state, true);
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

		$scope.updateRandomInfo = function() {
			var g = getGameState();
			$scope.all_damage = g.a_ad * 100;
			g.get_all_skills();
			$scope.tap_damage = parseFloat(g.tap_damage()[0].toPrecision(4));
		};

		var stateToUrl = function(s) {
			var pieces = s.split("|");
			var newA = [];
			pieces[0].split(",").forEach(function(a, i, array) {
				var v = a.split(".");
				var aindex = parseOrZero(v[0], parseInt);
				var avalue = parseOrZero(v[1], parseInt);
				newA.push(encode(aindex.toString()) + "." + encode(avalue.toString()));
			});
			pieces[0] = newA.join();
			var newH = [];
			pieces[1].split(",").forEach(function(h, i, array) {
				var v = h.split(".");
				var hlevel = parseOrZero(v[0], parseInt);
				var hweapons = parseOrZero(v[1], parseInt);
				newH.push(encode(hlevel.toString()) + "." + encode(hweapons.toString()));
			});
			pieces[1] = newH.join();
			return pieces.join("|");
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
			// console.log(stateToUrl($scope.state));
			// console.log(LZString.compressToEncodedURIComponent(stateToUrl($scope.state)));
			// console.log(LZString.compressToEncodedURIComponent($scope.state));
			$scope.url = "http://yatto.me/#/calculator?state=" + LZString.compressToEncodedURIComponent($scope.state);
		};

		$scope.stateChanged = function(cookies) {
			// re-generate state
			$scope.generateStateString();

			shareVariables.setVariable("artifacts", $scope.artifacts);

			// store state to cookies
			if (cookies) {
				$scope.updateCookies();
			}

			// recalculate things
			$scope.updateRelicInfo();
			$scope.updateWeaponInfo();
			$scope.updateRandomInfo();
		};

		// 9.289,4.217,1.190,10.94,3.319,0.58,18.190,11.276,15.290,26.180,19.108,5.245,25.350,13.
		// 225,24.90,8.118,6.25,7.25,12.10,14.10,16.10,17.10,2.10,20.25,21.10,22.10,23.25,27.10,
		// 28.5|800.12,800.8,800.11,800.6,800.6,800.8,800.8,800.8,800.12,800.13,800.14,800.14,800.
		// 12,800.3,800.5,800.7,800.4,800.5,800.9,800.6,800.8,800.7,800.7,800.6,800.3,800.10,800.8,
		// 800.9,800.4,800.11,800.5,800.13,2100.5|0.8,0.81,0.66,1.67,0.11,0.44|1,1,1,1,0,0|542280|0|1|15|0|350|27700
		$scope.importFromString = function(state, cookies) {
			var t = state.split("|");

			// state verification
			if (occurrences(state, "|", false) != 10 ||
				  occurrences(t[0], ",", false) != 28 ||
				  occurrences(t[0], ".", false) != 29 ||
				  occurrences(t[1], ",", false) != 32 ||
				  occurrences(t[1], ".", false) != 33 ||
				  occurrences(t[2], ",", false) != 5  ||
				  occurrences(t[3], ",", false) != 5) {
				console.log("bad state:");
				console.log(state);
				return;
			}

			var artifacts = [];
			t[0].split(",").forEach(function(a, i, array) {
				var v = a.split(".");
				var aindex = parseOrZero(v[0], parseInt);
				var avalue = parseOrZero(v[1], parseInt);
				artifacts.push({
					name: artifact_info[aindex].name,
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

			$scope.stateChanged(cookies);
		};

		var getGameState = function() {
			return new GameState(
				transformScopeArray($scope.artifacts),
				getWeapons(),
				getLevels(),
				transformScopeArray($scope.customizations));
		};

		$scope.artifactCheck = function(i, ai) {
			if ($scope.artifact_caps[ai] != null &&
					$scope.artifacts[i].value > $scope.artifact_caps[ai]) {
				$scope.artifacts[i].value = $scope.artifact_caps[ai];
			}
			if ($scope.artifacts[i].value == null) {
				$scope.artifacts[i].value = 0;
			}
			if (ai == 25) {
				$scope.r_undead = $scope.artifacts[i].value;
			}
			$scope.stateChanged(true);
		};

		$scope.heroesCheck = function(i, ai) {
			if ($scope.heroes[i].level == null) {
				$scope.heroes[i].level = 0;
			}
			if ($scope.heroes[i].weapons == null) {
				$scope.heroes[i].weapons = 0;
			}
			$scope.r_levels = getLevels().reduce(function(a, b) { return a + b; });
			$scope.stateChanged(true);
		};

		$scope.customizationCheck = function(i, ai) {
			$scope.stateChanged(true);
			// $scope.generateStateString();
		};

		// // testing stuff
		// var g = new GameState(transformScopeArray($scope.artifacts),
		// 	getWeapons(), getLevels(), transformScopeArray($scope.customizations));
		// // console.log(g.next_ff_level());
		// // g.get_all_skills();
		// console.log(g.gold_multiplier());

		var sortByArtifactOrder = function(s) {
			var indexToSStep = {};
			for (var ss in s) {
				indexToSStep[s[ss].index] = s[ss];
			}
			var newSS = [];
			var aOrder = $scope.artifacts.map(function(a) { return a.index; });
			for (var i in aOrder) {
				if (aOrder[i] in indexToSStep) {
					newSS.push(indexToSStep[aOrder[i]]);
				}
			}
			return newSS;
		};

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
						$scope.summary_steps[m] = sortByArtifactOrder(response[m]["summary"]);
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
			$scope.updateCookies();
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

			$scope.stateChanged(true);
		};

		// initialize
		setDefaults();
		$scope.readFromCookies();
		if ("state" in $routeParams) {
			$scope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
			$scope.importFromString($scope.state, false);
		}

		$scope.generateStateString();
		$scope.updateRelicInfo();
		$scope.updateWeaponInfo();

		shareVariables.setVariable("artifacts", $scope.artifacts);

		common();
	}
);