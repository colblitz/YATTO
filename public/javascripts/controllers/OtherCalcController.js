yattoApp.controller('OtherCalcController',
	function($scope, $rootScope) {

		var setDefaults = function() {
			$scope.customizationLabels = [
				"Swords - All Damage",
				"Scarves - Crit Damage",
				"Hats - Gold Dropped",
				"Auras - Chest Gold",
				"Armor - Crit Chance",
				"Trails - Tap Damage"
			];
			$scope.oc_customizations = [[], [], [], [], [], []];
			customization_info.forEach(function(c, i) {
				$scope.oc_customizations[cMapping[c.label[0]]].push({
					name: c.name,
					value: c.value,
					cost: c.cost,
					type: c.ctype,
					owned: false
				});
			});

			$scope.diamonds = 0;
			$scope.unowned_customizations = [];
		};

		var getDmgE = function() {

		};

		$scope.recalculate = function() {
			$scope.diamonds = 0;
			$scope.unowned_customizations = [];
			for (var type in $scope.oc_customizations) {
				$scope.oc_customizations[type].forEach(function(c, i) {
					if (!c.owned && c.type == CTYPE_D) {
						$scope.unowned_customizations.push(c);
						$scope.diamonds += c.cost;
					}
				});
			}

			$scope.unowned_customizations = $scope.unowned_customizations.sort(function(c1, c2) {

			});
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
				t[3].split(",").forEach(function(l, i, array) {
					$scope.heroes[i].level = parseOrZero(l, parseInt);
				});
				t[4].split(",").forEach(function(c, i, array) {
					$scope.customizations[i].value = parseOrZero(c, parseFloat);
				})

				$scope.active    = parseOrZero(t[13], parseInt) == 1 ? true : false;
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