yattoApp.controller('CalculatorController',
	function($scope, $http, $cookies, $cookieStore, $timeout, $rootScope, $routeParams, localStorageService, usSpinnerService, shareVariables) {
		MathJax.Hub.Configured();
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  	console.log("calculator");
  	// $scope.loggedIn = function() {
  	// 	console.log("alkjsldkjfasdF");
   //    return shareVariables.getVariable("loggedIn");
   //  };
   	console.log($rootScope.loggedIn);

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
				{name: "Gold",              index: 0, value: true, tabname: "Gold"},
				{name: "All Damage",        index: 1, value: true, tabname: "ADmg"},
				{name: "Tap Damage",        index: 2, value: true,  tabname: "TDmg"},
				{name: "Dmg Equivalent", index: 3, value: true,  tabname: "DmgE"},
				{name: "Relics/second",     index: 4, value: false, tabname: " R/s "},
				{name: "Stages/second",     index: 5, value: false, tabname: " S/s "}];

			$scope.methods[0]["tooltip"] = "Calculates gold multiplier";
			$scope.methods[1]["tooltip"] = "Calculates all damage value";
			$scope.methods[2]["tooltip"] = "Calculates tap damage with crits";
			$scope.methods[3]["tooltip"] = "Calculates mix of gold and tap damage";
			$scope.methods[4]["tooltip"] = "Calculates relics per second";
			$scope.methods[5]["tooltip"] = "Calculates stages per second blah blah this is going to be a long ass explanation because I'll need to explain stages and tie breaking";

			$scope.tabs = [
				true,
				false,
				false,
				false,
				false,
				false
			];
			$scope.activetab = 0;

			$scope.relics = 0;
			$scope.nsteps = 0;
			$scope.greedy = 1;
			$scope.active = false;
			$scope.critss = 0;
			$scope.zerker = 0;

			$scope.w_chiprob = 0;
			$scope.w_totalwp = 0;
			$scope.w_tonexts = 0;
			$scope.w_getting = 0;
			$scope.w_probset = 0;

			$scope.r_cstage = 0;
			$scope.r_undead = 0;
			$scope.r_levels = 0;
			$scope.r_hbonus = 0;
			$scope.r_sbonus = 0;
			$scope.r_reward = 0;
			$scope.r_nextbp = 0;
			$scope.r_atnext = 0;

			$scope.all_damage = 0;
			$scope.dps_damage = 0;
			$scope.tap_damage = 0;
			$scope.twc_damage = 0;

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

		$scope.setActiveTab = function() {
			if ($scope.steps.length > 0) {
				for (var m in $scope.methods) {
					var i = $scope.methods[m].index;
					if (i in $scope.steps && $scope.steps[i] != null) {
						$scope.tabs[i] = true;
						$scope.activetab = i;
						break;
					} else {
						$scope.tabs[i] = false;
					}
				}
			}
		}

		$scope.readFromCookies = function() {
			var cookie_state = localStorageService.get('state');
			var cookie_steps = localStorageService.get('steps');
			var cookie_summs = localStorageService.get('summs');
			var cookie_autoc = localStorageService.get('autoc');

			if (isNonNull(cookie_state)) { $rootScope.state = cookie_state; }
			if (isNonNull(cookie_steps)) { $scope.steps = cookie_steps; }
			if (isNonNull(cookie_summs)) { $scope.summary_steps = cookie_summs; }
			if (isNonNull(cookie_autoc)) { $scope.autocookies = cookie_autoc; }

			$scope.setActiveTab();
			$scope.importFromString($rootScope.state, true);
		};

		$scope.storeToCookies = function() {
			localStorageService.set('state', $rootScope.state);
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

			heroRelics = Math.round(heroRelics * uaMultiplier);

			stageRelics = Math.ceil(stageRelics * uaMultiplier);
			stageRelics = isNaN(stageRelics) ? 0 : stageRelics;

			$scope.r_hbonus = heroRelics;
			$scope.r_sbonus = stageRelics;

			$scope.r_nextbp = (Math.floor($scope.r_cstage / 15) + 1) * 15;
			$scope.r_reward = Math.round(2 * (stageRelics + heroRelics));

			stageRelics = Math.pow(Math.floor($scope.r_nextbp/15) - 5, 1.7);
			stageRelics = Math.ceil(stageRelics * uaMultiplier);
			stageRelics = isNaN(stageRelics) ? 0 : stageRelics;
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

		$scope.updateStatsInfo = function() {
			var g = getGameState();
			g.get_all_skills();
			var tap = g.tap_damage();
			$scope.all_damage = g.a_ad * 100;
			$scope.dps_damage = parseFloat(g.get_hero_dps().toPrecision(4));
			$scope.tap_damage = parseFloat(tap[0].toPrecision(4));
			$scope.twc_damage = parseFloat(tap[1].toPrecision(4));
			$scope.twa_damage = parseFloat(tap[2].toPrecision(4));
		};

		var updateStateString = function(i, value) {
			var s = $rootScope.state;
			var t = s.split("|");
			t[i] = value;
			$rootScope.state = t.join("|");
		}

		$scope.generateStateString = function() {



			$rootScope.state = [
				$rootScope.versionS,
				$scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join(),
				$scope.heroes.map(function(h) { return h.weapons; }).join(),
				$scope.heroes.map(function(h) { return h.level; }).join(),
				$scope.customizations.map(function(c) { return c.value; }).join(),
				$scope.methods.map(function(m) { return m.value ? 1 : 0; }).join(),
				$scope.relics,
				$scope.nsteps,
				$scope.greedy,
				$scope.w_getting,
				$scope.r_cstage,
				$scope.r_undead,
				$scope.r_levels,
				$scope.active ? 1 : 0,
				$scope.critss,
				$scope.zerker,
				$scope.a_currentSeed,
				$scope.w_currentSeed,
				$scope.rest_of_state].join("|");
			$scope.url = "http://yatto.me/#/calculator?state=" + LZString.compressToEncodedURIComponent($rootScope.state);
		};

		$scope.stateChanged = function(cookies) {
			// re-generate state
			$scope.generateStateString();

			shareVariables.setVariable("artifacts", $scope.artifacts);
			shareVariables.setVariable("weapons", getWeapons());

			// store state to cookies
			if (cookies) {
				$scope.updateCookies();
			}

			// recalculate things
			$scope.updateRelicInfo();
			$scope.updateWeaponInfo();
			$scope.updateStatsInfo();
		};

		// 9.289,4.217,1.190,10.94,3.319,0.58,18.190,11.276,15.290,26.180,19.108,5.245,25.350,13.
		// 225,24.90,8.118,6.25,7.25,12.10,14.10,16.10,17.10,2.10,20.25,21.10,22.10,23.25,27.10,
		// 28.5|800.12,800.8,800.11,800.6,800.6,800.8,800.8,800.8,800.12,800.13,800.14,800.14,800.
		// 12,800.3,800.5,800.7,800.4,800.5,800.9,800.6,800.8,800.7,800.7,800.6,800.3,800.10,800.8,
		// 800.9,800.4,800.11,800.5,800.13,2100.5|0.8,0.81,0.66,1.67,0.11,0.44|1,1,1,1,0,0|542280|0|1|15|0|350|27700
		$scope.importFromString = function(state, cookies) {
			var t = state.split("|");
			if (t[0][0] == "v") {
				try {
					var artifacts = [];
					t[1].split(",").forEach(function(a, i, array) {
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
					t[2].split(",").forEach(function(w, i, array) {
						$scope.heroes[i].weapons = parseOrZero(w, parseInt);
					});
					t[3].split(",").forEach(function(l, i, array) {
						$scope.heroes[i].level = parseOrZero(l, parseInt);
					});
					t[4].split(",").forEach(function(c, i, array) {
						$scope.customizations[i].value = parseOrZero(c, parseFloat);
					})
					t[5].split(",").forEach(function(m, i, array) {
						$scope.methods[i].value = m == 1 ? true : false;
					})
					$scope.relics    = parseOrZero(t[6], parseInt);
					$scope.nsteps    = parseOrZero(t[7], parseInt);
					$scope.greedy    = parseOrZero(t[8], parseInt);
					$scope.w_getting = parseOrZero(t[9], parseInt);
					$scope.r_cstage  = parseOrZero(t[10], parseInt);
					$scope.r_undead  = parseOrZero(t[11], parseInt);
					$scope.r_levels  = parseOrZero(t[12], parseInt);
					$scope.active    = parseOrZero(t[13], parseInt) == 1 ? true : false;
					$scope.critss    = parseOrZero(t[14], parseInt);
					$scope.zerker    = parseOrZero(t[15], parseInt);
					$scope.a_currentSeed = parseOrZero(t[16], parseInt);
					$scope.w_currentSeed = parseOrZero(t[17], parseInt);
					$scope.rest_of_state = t.slice(18)
					$scope.a_aPriorities = t[17].split(",").map(function(p) { return parseOrZero(p, parseInt); });
					$scope.a_maxDiamonds = parseOrZero(t[18], parseInt);

					$scope.w_toCalculate = parseOrZero(t[20], parseInt);
				} catch (err) {
					console.log("bad state: " + state);
					console.log(err);
				}
			} else {
				// Old stuff
				// state verification
				if (occurrences(t[0], ",", false) != 28 ||
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
				$scope.active    = parseOrZero(t[11], parseInt) == 1 ? true : false;
				$scope.critss    = parseOrZero(t[12], parseInt);
				$scope.zerker    = parseOrZero(t[13], parseInt);
			}

			$scope.stateChanged(cookies);
		};

		var getGameState = function() {
			return new GameState(
				transformScopeArray($scope.artifacts),
				getWeapons(),
				getLevels(),
				transformScopeArray($scope.customizations),
				{ cs: $scope.critss, br: $scope.zerker });
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
		};

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
				response = get_steps({
					a: artifacts,
					w: weapons,
					l: levels,
					c: customizations,
					m: methods,
					r: $scope.relics,
					n: $scope.nsteps,
					g: $scope.greedy,
					s: $scope.active,
					t: $scope.critss,
					z: $scope.zerker});

				$scope.$apply(function() {
					$scope.steps = [];
					$scope.summary_steps = [];
					for (var m in response) {
						$scope.steps[m] = response[m]["steps"];
						$scope.summary_steps[m] = sortByArtifactOrder(response[m]["summary"]);
					}

					if (!($scope.activetab in $scope.steps && $scope.steps[$scope.activetab] != null)) {
						$scope.setActiveTab();
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

		var cMapping = {
			"0": 2,
			"1": 1,
			"2": 4,
			"3": 0,
			"4": 5,
			"5": 3
		};

		var parseCustomizations = function(s) {
			var c = [0, 0, 0, 0, 0, 0];
			s.split("/").forEach(function(p, i, array) {
				c[cMapping[p[0]]] += customizationValues[p];
			});
			return c.map(function(f) { return parseFloat(f.toPrecision(3)); });
		}

		$scope.filechanged = function() {
			// console.log("savefile: " + savefile);
			console.log("here");
			// console.log("changed: " + $scope.savefile);
			var b = $scope.savefile.indexOf("playerInfoSaveString");
			var e = $scope.savefile.indexOf("lastUsedTexture");
			console.log("index of playerInfoSaveString: " + b);
			console.log("index of lastUsedTexture: " + e);
			var s = $scope.savefile.substring(b + 22, e-2);
			// http://pastebin.com/Fz0pz0BV
			var j = JSON.parse(JSON.parse(s));

			var artifactLevels = j.artifactLevels;
			var customizations = j.unlockedPlayerCustomizations;
			var relics = j.playerRelics;
			var diamonds = j.playerDiamonds;
			var artifactSeed = j.nextArtifactSeed;
			var weaponSeed = j.heroSave.heroWeaponSeed;
			var weapons = j.heroSave.heroWeaponUpgrades;
			var levels = j.heroSave.heroLevels;

			console.log(artifactLevels);
			console.log(customizations);
			console.log(parseCustomizations(customizations));
			console.log(relics);
			console.log(diamonds);
			console.log(artifactSeed);
			console.log(weaponSeed);
			console.log(weapons);
			console.log(levels);

			// 0/0/0/0/0/0
			// 14/9/3/901/1/1
			// 2/1/1/902/2/2

			// 3/3/2/903/3/3
			// 6/2/4/904/4/5
			// 1/8/6/905/5/8

			// 8/4/14/906/6/6
			// 9/5/13/907/7/7
			// 10/6/8/19/8/9

			// 13/7/9/3/9/10
			// 11/10/11/4/10/10
			// 11/10/12/29/10/10

			// gold dropp - 11 0_0 / 0_14 / 0_2 / 0_3 / 0_6 / 0_1 / 0_8 / 0_9 / 0_10 / 0_13 / 0_11 /
			// cri damage - 11 1_0 / 1_9 / 1_1 / 1_3 / 1_2 / 1_8 / 1_4 / 1_5 / 1_6 / 1_7 / 1_10 /
			// cri chance - 14 2_0 / 2_3 / 2_1 / 2_2 / 2_4 / 2_6 / 2_14 / 2_13 / 2_8 / 2_9 / 2_11 / 2_12 / 2_17 / 2_16 /
			// all damage - 20 3_0 / 3_901 / 3_902 / 3_903 / 3_904 / 3_905 / 3_906 / 3_907 / 3_19 / 3_3 / 3_4 / 3_30 / 3_26 / 3_1 / 3_13 / 3_5 / 3_15 / 3_20 / 3_14 / 3_7 /
			// tap damage - 11 4_0 / 4_1 / 4_2 / 4_3 / 4_4 / 4_5 / 4_6 / 4_7 / 4_8 / 4_9 / 4_10 /
			// chest gold - 10 5_0 / 5_1 / 5_2 / 5_3 / 5_5 / 5_8 / 5_6 / 5_7 / 5_9 / 5_10

			// chest gold
			// none 0 0
			// stars 5 1
			// thunderbolt 7 2
			// electric 10 3
			// eminence light 10 5
			// spiky 10 8
			// leaf shield 50 6
			// resurrection light 15 7
			// skulls 40 9
			// bubbles 20 10

			// critical Hit
			// hero suit 0 0
			// casual 0.5 3
			// astronaut 0.5 1
			// blue knight 0.5 2
			// cat suit 0.5 4
			// ninja 0.5 6
			// purple wizard 0.5 14
			// pygamas 1 13
			// rennaissance 0.5 8
			// robot 1 9
			// snowman 3 11
			// storm armor 0.5 12
			// green knight 1 17
			// white and gold 1 16

			// tap damage
			// white 0 0
			// cool blue 4 1
			// rainbow 4 2
			// dirt 4 3
			// flame 4 4
			// ice 4 5
			// lightning blue 6 6
			// fiery red 2 7
			// passion 8 8
			// shadow 2 9
			// water 6 10

			// all damage
			// hero sword +0 0
			// knight sword +2 901
			// charlemagne +2 902
			// ice sword +3 903
			// fire sword +3 904
			// mad max +4 905
			// purple dragon +4 906
			// warrior blade +5 907
			// skull blade +5 19
			// goofy hammer +6 3
			// carrot +6 4
			// kunai +7 29
			// laser dagger +6 30
			// broom 3 26
			// curved blade 1 1
			// umbrella 9 13
			// fencing sword 5 5
			// meat hook 1 15
			// sai 2 20
			// wooden sword 5 14
			// hola sword 8 7

			// crit damage
			// red 0 0
			// shimmering 3 9
			// blue 5 1
			// blue wrap 7 3
			// green 10 2
			// red wrap 1 8
			// green wrap 4 4
			// yellow 4 5
			// yellow wrap 19 6
			// purple 22 7
			// brown 6 10

			// gold Dropped
			// none 0 0
			// top hat 5 14
			// blue knight 5 2
			// cat hood 5 3
			// ninja mask 5 6
			// astronaut helmet 5 1
			// witch hat 10 8
			// robot helmet 13 9
			// snowman head 6 10
			// water melon 7 13
			// bat 5 11




			// console.log(jj.artifactLevels);
			// console.log($scope.savefile.substring())
			// $scope.$apply(function(scope) {
			// 	var saveFile = element.files[0];
			// 	var reader = new FileReader();
			// 	reader.onload = function(e) {
			// 		console.log(e);
			// 	};
			// 	reader.readAsDataURL(saveFile);
			// });
		};

		$scope.saveUserState = function() {
			if ($rootScope.loggedIn) {
				console.log("is logged in");
				console.log("sending: " + $rootScope.state);
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
			}
		}

		$scope.$on('stateUpdate', function() {
			// TODO: update from rootScope.state
		});

		// initialize
		setDefaults();
		$scope.readFromCookies();
		if ("state" in $routeParams) {
			$rootScope.state = LZString.decompressFromEncodedURIComponent($routeParams.state);
			$scope.importFromString($rootScope.state, false);
		}

		$scope.generateStateString();
		$scope.updateRelicInfo();
		$scope.updateWeaponInfo();

		shareVariables.setVariable("artifacts", $scope.artifacts);
		shareVariables.setVariable("weapons", getWeapons());
	}
);