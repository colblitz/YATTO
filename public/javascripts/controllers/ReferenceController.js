yattoApp.controller('ReferenceController',
	function($scope, shareVariables, localStorageService) {
		MathJax.Hub.Configured();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			console.log("lakjsldjflkajsdf");
			console.log(shareVariables.getVariable("artifacts"));


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

			$scope.readFromCookies = function() {
				var cookie_state = localStorageService.get('state');
				if (hasCookie(cookie_state)) { return$scope.state = cookie_state; }
				$scope.importFromString($scope.state, true);
			};

			// TODO: refactor this somewhere, is copy
			/** Function count the occurrences of substring in a string;
			 * @param {String} string   Required. The string;
			 * @param {String} subString    Required. The string to search for;
			 * @param {Boolean} allowOverlapping    Optional. Default: false;
			 */
			var occurrences = function(string, subString, allowOverlapping){
					string+=""; subString+="";
					if(subString.length<=0) return string.length+1;

					var n=0, pos=0;
					var step=(allowOverlapping)?(1):(subString.length);

					while(true){
							pos=string.indexOf(subString,pos);
							if(pos>=0){ n++; pos+=step; } else break;
					}
					return(n);
			};

			// TODO: this too
			var parseOrZero = function(s, f) {
				var i = f(s);
				if (i == null || isNaN(i)) {
					i = 0;
				}
				return i;
			};

			$scope.importFromString = function(state) {
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
					return [];
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
				return artifacts;
			};

			$scope.initialize = function() {
				setDefaults();
				var artifacts = [];
				// get from calculator controller
				if (shareVariables.hasVariable("artifacts")) {
					artifacts = shareVariables.getVariable("artifacts");
				} else {
					// try getting from cookies
					var state = localStorageService.get('state')
					if (typeof state !== "undefined" && state != null) {
						artifacts = $scope.importFromString(state);
					}
				}

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