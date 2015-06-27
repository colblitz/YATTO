yattoApp.controller('ReferenceController',
	function($scope, $rootScope, shareVariables, localStorageService) {
		MathJax.Hub.Configured();
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		var setDefaults = function() {
			$scope.r_artifacts = [];

			for (var i in artifact_info) {
				var a = artifact_info[i];
				var artifact = {
					name: a.name,
					index: i,
					ad0: a.ad0,
					adpl: a.adpl,
					cap: isFinite(a.levelcap) ? a.levelcap : null,
					x: a.x.toFixed(1),
					y: a.y.toFixed(1),
					current: 0,
					desired: 0,
					cost: 0,
					cumulative: 0,
					magnitude: "",
					text: "",
					costf: a.cost,
					effect: a.effect,
					description: a.description
					// test: function(l) { return Math.round(a.cost(l)); } // TODO: wtf doesn't this work
				};
				$scope.r_artifacts.push(artifact);
			}

			$scope.r_heroes = [];
			var skill_types = [
				"Hero DPS",
				"All damage",
				"Crit damage",
				"Tap damage",
				"Percent DPS",
				"Chest Gold",
				"Gold Dropped",
				"Boss Damage",
				"Crit Chance"
			];

			var typeclasses = [
				"skill-dps",
				"skill-ad",
				"skill-cd",
				"skill-td",
				"skill-pd",
				"skill-cg",
				"skill-gd",
				"skill-bd",
				"skill-cc"
			];

			for (var h in hero_info) {
				var h = hero_info[h];
				var hero = {
					name: h.name,
					cost: h.base_cost.toPrecision(4),
					skills: h.skills.map(function(s) {
						return {
							magnitude: s[0] * 100 > 1 ? Math.round(s[0] * 100) : s[0] * 100,
							type: skill_types[s[1]],
							typeclass: typeclasses[s[1]]
						};
					})
				};
				$scope.r_heroes.push(hero);
			}
		};

		var getMagnitude = function(a) {
			var l = Math.max(0, Math.min(a.desired, a.cap == null ? Infinity : a.cap));
			if (l == 0) {
				return "";
			}
			var s = (l * a.effect).toString() + "% ";
			if (a.effect > 0) {
				s = "+" + s;
			}
			return s;
		};

		var getText = function(a) {
			var s = a.description;
			if (s.indexOf("duration") > -1) {
				s = s + "(" + Math.round(30 * ((a.desired * 10) / 100 + 1)).toString() + " s without cooldown)";
			}
			return s;
		};

		$scope.calcArtifacts = function(i) {
			var a = $scope.r_artifacts[i];
			if (a.current != 0) {
				a.cost = Math.ceil(a.costf(a.current+1));
				a.cumulative = 0;
				for (var l = a.current; l < a.desired; l++) {
					a.cumulative += Math.ceil(a.costf(l+1));
				}
			} else {
				a.cost = 0;
				a.cumulative = 0;
			}
			a.magnitude = getMagnitude(a);
			a.text = getText(a);
		};

		// TODO: update this
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
				$scope.r_artifacts[a.index].current = a.value;
				$scope.r_artifacts[a.index].desired = a.value;
			}
			for (var i in $scope.r_artifacts) {
				$scope.calcArtifacts(i);
			}
		};

		$scope.initialize = function() {
			setDefaults();
			$scope.updateFromState();
		};

		$scope.$on('stateUpdate', function() {
			$scope.updateFromState();
		});

		$scope.initialize();
	}
);