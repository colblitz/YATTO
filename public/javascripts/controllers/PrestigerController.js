yattoApp.controller('PrestigerController',
	function($scope, $rootScope) {

		var setDefaults = function() {
			$scope.p_artifacts = [];
			for (var i in artifact_info) {
				var a = artifact_info[i];
				var artifact = {
					name: a.name,
					index: i,
					value: 0
				};
				$scope.p_artifacts.push(artifact);
			}

			$scope.p_weapons = [];
			$scope.p_customizations = [
				{name: "All Damage",      index: 0, value: 0},
				{name: "Critical Damage", index: 1, value: 0},
				{name: "Gold Dropped",    index: 2, value: 0},
				{name: "Chest Gold",      index: 3, value: 0},
				{name: "Critical Hit",    index: 4, value: 0},
				{name: "Tap Damage",      index: 5, value: 0}];
		};



		$scope.updateFromState = function() {
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

			for (var i in artifacts) {
				var a = artifacts[i];
				$scope.p_artifacts[a.index].value = a.value;
			}

			var weapons = t[2].split(",").map(function(w) { return parseOrZero(w, parseInt); });

			$scope.p_weapons = [];
			for (var i in weapons) {
				var index = parseInt(i);
				$scope.p_weapons.push({
					name: heroToName[index + 1],
					value: weapons[index]
				});
			}

			var customizations = t[4].split(",").map(function(c) { return parseOrZero(c, parseFloat); });
			console.log(customizations);
			for (var c in customizations) {
				console.log(c);
				$scope.p_customizations[c].value = customizations[c];
			}
		};

		$scope.initialize = function() {
			$scope.updateFromState();
		};

		setDefaults();
		$scope.initialize();

		$scope.$on('stateUpdate', function() {
			$scope.updateFromState();
		});
	}
);