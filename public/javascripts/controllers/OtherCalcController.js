yattoApp.controller('OtherCalcController',
	function($scope, $rootScope) {

		var setDefaults = function() {
			// TODO: refactor away
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
				{name: "All Damage",      index: 0, value: 0, step: 0.01,  max: 0.87},
				{name: "Critical Damage", index: 1, value: 0, step: 0.01,  max: 0.81},
				{name: "Gold Dropped",    index: 2, value: 0, step: 0.01,  max: 0.66},
				{name: "Chest Gold",      index: 3, value: 0, step: 0.01,  max: 1.67},
				{name: "Critical Hit",    index: 4, value: 0, step: 0.005, max: 0.11},
				{name: "Tap Damage",      index: 5, value: 0, step: 0.01,  max: 0.44}];

			$scope.customizationLabels = [
				"Swords - All Damage",
				"Scarves - Crit Damage",
				"Hats - Gold Dropped",
				"Auras - Chest Gold",
				"Armor - Crit Chance",
				"Trails - Tap Damage"
			];
			$scope.oc_customizations = [[], [], [], [], [], []];
			$scope.oc_customization_totals = [0, 0, 0, 0, 0, 0];
			customization_info.forEach(function(c, i) {
				var ce = c.value / c.cost;
				$scope.oc_customizations[cMapping[c.label[0]]].push({
					name: c.name,
					value: c.value,
					cost: c.cost,
					ctype: c.ctype,
					type: c.type,
					coste: isNaN(ce) ? 0 : ce,
					owned: c.ctype != CTYPE_D
				});
			});

			$scope.diamonds = 0;
			$scope.unowned_customizations = [];
		};

		// TODO: refactor away
		var getWeapons = function() {
			return transformScopeArray($scope.heroes.map(function (h) {
				return {index: h.index, value: h.weapons}; }));
		};

		var getLevels = function() {
			return transformScopeArray($scope.heroes.map(function (h) {
				return {index: h.index, value: h.level}; }));
		};

		var transformScopeArray = function(scopeArray) {
			var newArray = newZeroes(scopeArray.length);
			for (var x in scopeArray) {
				var thing = scopeArray[x];
				newArray[thing.index] = parseFloat(thing.value);
			}
			return newArray;
		};

		var getGameState = function(c) {
			return new GameState(
				transformScopeArray($scope.artifacts),
				getWeapons(),
				getLevels(),
				c,
				{ cs: $scope.critss, br: $scope.zerker });
		};

		var getDmgE = function(c) {
			var g = getGameState(c);
			g.get_all_skills();
			return [g.gold_multiplier(), g.tap_damage()[1]];
		};

		$scope.recalculate = function() {
			$scope.diamonds = 0;
			$scope.unowned_customizations = [];
			$scope.oc_customization_totals = [0, 0, 0, 0, 0, 0];

			var tc = [[], [], [], [], [], []];
			for (var type in $scope.oc_customizations) {
				$scope.oc_customizations[type].forEach(function(c, i) {
					if (!c.owned && c.ctype == CTYPE_D) {
						tc[type].push(c);
						$scope.diamonds += c.cost;
					}
					if (c.owned) {
						$scope.oc_customization_totals[c.type] += c.value / 100;
					}
				});
			}

			tc = tc.filter(function(n){ return n.length != 0 });

			// sort unowned by efficiency
			for (var type in tc) {
				tc[type] = tc[type].sort(function(c1, c2) {
					return c2.coste - c1.coste;
				});
			}

			var temp_totals = $scope.oc_customization_totals.slice(0);
			while (tc.length > 1) {
				var base = getDmgE(temp_totals);
				var max = 0;
				var maxi = -1;
				for (t in tc) {
					var c = tc[t][0];
					var new_totals = temp_totals.slice(0);
					new_totals[c.type] += c.value / 100;
					var new_value = getDmgE(new_totals);

					var gold_ratio = new_value[0] / base[0];
					var tdmg_ratio = new_value[1] / base[1];
					var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_ratio) / Math.log(1.075));
					var eq_tdmg = (gold_dmg_equivalent - 1) * base[1] + new_value[1];
					var eff = (eq_tdmg - base[1]) / c.cost;
					if (eff > max) {
						max = eff;
						maxi = t;
					}
				}
				var bestc = tc[maxi].shift();
				if (tc[maxi].length == 0) {
					tc.splice(maxi, 1);
				}
				temp_totals[bestc.type] += bestc.value / 100;
				$scope.unowned_customizations.push(bestc);
			}

			// var base = getDmgE($scope.oc_customization_totals);
			// console.log("base: " + base);
			// for (i in $scope.unowned_customizations) {
			// 	console.log("--------------------------------");
			// 	var c = $scope.unowned_customizations[i];
			// 	var new_totals = $scope.oc_customization_totals.slice(0);
			// 	new_totals[c.type] += c.value / 100;
			// 	console.log(new_totals);
			// 	var new_value = getDmgE(new_totals);

			// 	var gold_ratio = new_value[0] / base[0];
			// 	var tdmg_ratio = new_value[1] / base[1];
			// 	var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_ratio) / Math.log(1.075));
			// 	var eq_tdmg = (gold_dmg_equivalent - 1) * base[1] + new_value[1];
			// 	c.efficiency = (eq_tdmg - base[1]) / c.cost;

			// 	console.log(c.name + ":");
			// 	console.log("   " + c.cost);
			// 	console.log("   " + c.efficiency);
			// }
			// $scope.unowned_customizations = $scope.unowned_customizations.sort(function(c1, c2) {
			// 	c1.efficiency - c2.efficiency;
			// });
		};

		$scope.updateFromState = function() {
			try {
				var t = $rootScope.state.split("|");

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
				// t[3].split(",").forEach(function(l, i, array) {
				// 	$scope.heroes[i].level = parseOrZero(l, parseInt);
				// });
				t[4].split(",").forEach(function(c, i, array) {
					$scope.customizations[i].value = parseOrZero(c, parseFloat);
				})

				$scope.critss    = parseOrZero(t[14], parseInt);
				$scope.zerker    = parseOrZero(t[15], parseInt);

				// $scope.updateThings();
			} catch (err) {
				// console.log(log("error updating state: " + err));
				// localStorageService.remove('state');
				setDefaults();
			}
			// var t = $rootScope.state.split("|");

			// var customizations = t[4].split(",").map(function(c) { return parseOrZero(c, parseFloat); });
			// console.log(customizations);
			// for (var c in customizations) {
			// 	console.log(c);
			// 	//$scope.p_customizations[c].value = customizations[c];
			// }
		};

		$scope.initialize = function() {
			$scope.updateFromState();
			$scope.recalculate();
		};

		setDefaults();
		$scope.initialize();

		$scope.$on('stateUpdate', function() {
			$scope.updateFromState();
		});
	}
);