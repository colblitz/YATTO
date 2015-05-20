yattoApp.controller('ReferenceController',
	function($scope, shareVariables) {
		MathJax.Hub.Configured();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			console.log("lakjsldjflkajsdf");
			console.log(shareVariables.getVariable("artifacts"));


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
					a.cost = Math.ceil(a.costf(a.current));
					a.cumulative = 0;
					for (var l = a.current; l < a.desired; l++) {
						a.cumulative += Math.ceil(a.costf(l));
					}
				} else {
					a.cost = 0;
					a.cumulative = 0;
				}
				a.magnitude = getMagnitude(a);
				a.text = getText(a);
			};

			$scope.initialize = function() {
				var artifacts = shareVariables.getVariable("artifacts");
				for (var i in artifacts) {
					var a = artifacts[i];
					$scope.r_artifacts[a.index].current = a.value;
					$scope.r_artifacts[a.index].desired = a.value;
				}
				for (var i in $scope.r_artifacts) {
					$scope.calcArtifacts(i);
				}
			};
			$scope.initialize();
	}
);