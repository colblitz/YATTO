yattoApp.controller('WeaponModalController', function ($scope, $modalInstance) {
	$scope.alreadySure = false;

	$scope.isSure = function() {
		$modalInstance.close({alreadySure: $scope.alreadySure});
	}

	$scope.justKidding = function() {
		$modalInstance.dismiss('cancel');
	}
});

yattoApp.controller('SequencerController',
	function($scope, $rootScope, $modal, shareVariables, localStorageService) {
		var costToBuy = function(i) {
			return Math.floor((i) * Math.pow(1.35, i));
		};

		var salvageCosts = {};

		var i = 0;
		while (i < 30) {
			var aCost = costToBuy(i);
			var nCost = costToBuy(i+1);
			var a = (aCost + nCost) * 1;
			salvageCosts[i] = Math.round(Math.pow(5, Math.log(a) / Math.log(10)) + 35);
			i += 1;
		}

		var setDefaults = function() {
			$scope.s_artifacts = [];
			$scope.w_steps = [];
			$scope.order_list = [];
			$scope.list = [];
			$scope.seed_artifact = 0;
			$scope.seed_weapon = 0;
			$scope.salvageint = 0;
			$scope.maxDiamonds = 0;
			$scope.timer = null;
			$scope.salvageError = "";
			$scope.cost_manual = 0;
			$scope.cost_auto = 0;
			$scope.weaponNum = 100;
			$scope.w_confirm = false;
			$scope.showWeapons = false;
			$scope.current_weapons = [];
			$scope.current_min = 0;
			$scope.after_min = 0;

			$scope.c = [0, 1, 2, 3];
			$scope.columns = [];
			$scope.columnCount = 4;
			$scope.alreadySure = false;

			for (var i in artifact_info) {
				var a = artifact_info[i];
				var artifact = {
					name: a.name,
					index: i,
					owned: false,
					priority: 0
				};
				$scope.s_artifacts.push(artifact);
			}

			if (isNonNull($rootScope.a_currentSeed)) {
				$scope.seed_artifact = $rootScope.a_currentSeed;
			}
			if (isNonNull($rootScope.a_aPriorities)) {
				// set priorities
			}
			if (isNonNull($rootScope.a_maxDiamonds)) {
				$scope.maxDiamonds = $rootScope.a_maxDiamonds;
			}
			if (isNonNull($rootScope.w_currentSeed)) {
				$scope.seed_weapon = $rootScope.w_currentSeed;
			}
			if (isNonNull($rootScope.w_toCalculate)) {
				$scope.weaponNum = $rootScope.w_toCalculate;
			}

		};

 //           10   11     12     13     14    14    14     15    15
		// var slist = [false, false, false, true, true, false, true, false];
		var getCostOfSalvages = function(owned, slist) {
			var i = owned + 1;
			var cost = 0;
			for (var s in slist) {
				if (!slist[s]) {
					i += 1;
				} else {
					cost += salvageCosts[i];
				}
			}
			return cost;
		};


		var getOwned = function() {
			return getOrderList().filter(function(x) {
				return $scope.s_artifacts[x].owned;
			}).length;
		}


		$scope.getList = function(reset, slist) {
			var steps = [];
			var currentSeed = $scope.seed_artifact;
			var list = getOrderList().filter(function(x) {
				return !$scope.s_artifacts[x].owned;
			});

			var salvages = [];
			if (!reset && isNonNull($scope.steps)) {
				salvages = $scope.steps.map(function(s) { return s.salvage; });
			}
			if (slist != null) {
				salvages = slist;
			}

			var num = getOwned() + 1;
			while (list.length > 0) {
				if (list.length == 1) {
					var next = list[0];
					var keep = !salvages[steps.length];

					steps.push({
						n: keep ? num + "." : "",
						index: next,
						name: artifact_info[next].name,
						salvage: !keep
					});
					if (keep) {
						list = [];
						num += 1;
					}
					currentSeed = unityRandom[currentSeed].nextSeed;
				} else {
					var numOwned = 29 - list.length;
					var index = unityRandom[currentSeed].values[numOwned];
					var next = list[index];
					var keep = !salvages[steps.length];

					if (keep) {
						list.splice(index, 1);
					}
					steps.push({
						n: keep ? num + "." : "",
						index: next,
						name: artifact_info[next].name,
						salvage: !keep
					});
					if (keep) {
						num += 1;
					}
					currentSeed = unityRandom[currentSeed].nextSeed;
				}
			}

			return steps;
		};

		var scoreAList = function(l) {
			var score = 0;
			var p = l.length;
			for (var a in l) {
				var ap = $scope.s_artifacts[l[a]].priority;
				score += ap * p;
				// score += Math.pow(ap/10, p);
				// score += $scope.s_artifacts[l[a].index].priority * p * p;
				p -= 1;
			}
			return score;
		};

		var pp = function(p) {
			if (p.length == 0) {
				return "[]";
			}
			return p;
		};

		var intToSalvage = function(i) {
			var s = (i >>> 0).toString(2);
			var sl = [];
			for (var l = s.length - 1; l >= 0; l--) {
				sl.push(s[l] == "1");
			}
			return sl;
		};

		$scope.reset = function() {
			for (var s in $scope.s_artifacts) {
				$scope.s_artifacts[s].priority = 0;
			}
			$scope.resetSearch();
		}

		$scope.resetSearch = function() {
			console.log("resetting");
			clearInterval($scope.timer);
			$scope.salvageint = 0;
			$scope.salvageError = "";
			$scope.best_steps = null;
			$scope.best_score = 0;
			$scope.running = false;
		};

		$scope.best_steps = [];
		$scope.best_score = 0;
		$scope.running = false;

		var startSearching = function() {
			$scope.$apply(function() {
				var tryList = intToSalvage($scope.salvageint);
				var cost = getCostOfSalvages(getOwned(), tryList);
				if ($scope.maxDiamonds == 0 || cost < $scope.maxDiamonds) {
					var a = $scope.getList(false, tryList);
					var f = a.filter(function(step) { return !step.salvage; }).map(function(step) { return step.index; });
					var newScore = scoreAList(f);
					if (newScore > $scope.best_score) {
						$scope.best_score = newScore;
						$scope.best_steps = a;
						$scope.cost_auto = cost;
					}
				}
				$scope.salvageint += 1;
			});
		};


		$scope.start = function() {
			if ($scope.s_artifacts.map(function(a) { return a.priority; })
													  .reduce(function(a, b) { return a + b; }, 0) == 0) {
				$scope.salvageError = "Need to set priorities!";
			} else {
				$scope.timer = setInterval(startSearching, 0);
				$scope.running = true;
			}
		};

		$scope.stop = function() {
			clearInterval($scope.timer);
			$scope.running = false;
		};

		$scope.importFromString = function(state) {
			var t = state.split("|");

			// state verification
			if (occurrences(t[0], ",", false) != 28 ||
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

			var weapons = [];
			t[1].split(",").forEach(function(h, i, array) {
				var v = h.split(".");
				weapons.push(parseOrZero(v[1], parseInt));
			});

			return [artifacts, weapons];
		};

		$scope.initialize = function() {
			setDefaults();
			var artifacts = [];
			var weapons = [];

			if (isNonNull($rootScope.state)) {
				var t = $scope.importFromString($rootScope.state);
				artifacts = t[0];
				weapons = t[1];
			} else {
				console.log("null root state");
				// try getting from cookies
				var state = localStorageService.get('state');
				console.log(state);
				if (isNonNull(state)) {
					var t = $scope.importFromString(state);
					artifacts = t[0];
					weapons = t[1];
				}
			}

			for (var i in artifacts) {
				var a = artifacts[i];
				$scope.s_artifacts[a.index].owned = a.value != 0;
			}

			$scope.current_weapons = [];
			for (var i in weapons) {
				var index = parseInt(i);
				$scope.current_weapons.push({
					name: heroToName[index + 1],
					n: weapons[index],
					a: weapons[index]
				});
			}

			$scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
			$scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));
		};

		$scope.stateChanged = function(reset, stopSearch, skip) {
			if (!skip) {
				$scope.steps = $scope.getList(reset, null);
				$scope.cost_manual = getCostOfSalvages(getOwned(), $scope.steps.map(function(s) { return s.salvage; }));
			}
			if (stopSearch) {
				$scope.resetSearch();
			}
		};

		$scope.initialize();
		$scope.stateChanged(true);

		$scope.weaponConfirm = function() {
			if ($scope.w_confirm) {
				calculateWeapons();
			} else {
				$scope.w_confirm = true;
			}
		};

		$scope.getWeapons = function() {
			$scope.showWeapons = true;
		};

		var calculateColumns = function() {
			var itemsPerColumn = Math.ceil($scope.w_steps.length / $scope.columnCount);
			$scope.columns = [];
			$scope.columns.push($scope.w_steps.slice(0, itemsPerColumn));
			$scope.columns.push($scope.w_steps.slice(itemsPerColumn, itemsPerColumn*2));
			$scope.columns.push($scope.w_steps.slice(itemsPerColumn*2, itemsPerColumn*3));
			$scope.columns.push($scope.w_steps.slice(itemsPerColumn*3));
		};

		$scope.check = function(index) {
			console.log(index);
			var new_w = [];
			var newi = 0;
			for (var w in $scope.w_steps) {
				if (w < index) {
					$scope.current_weapons[$scope.w_steps[w].wi].n += 1;
				} else {
					var weapon = $scope.w_steps[w];
					new_w.push({
						index: newi + 1,
						seed: weapon.seed,
						weapon: weapon.weapon,
						wi: weapon.wi,
						typeclass: weapon.typeclass
					})
					newi += 1;
				}
			}

			$scope.w_steps = new_w;
			$scope.seed_weapon = $scope.w_steps[0].seed;
			$scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
			$scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));

			calculateColumns();

		}


		$scope.openModal = function() {
			if (!$scope.alreadySure) {
				var modalInstance = $modal.open({
					templateUrl: 'weaponModal.html',
					controller: 'WeaponModalController',
					size: 'md',
					resolve: {
						alreadySure: function() {
							return $scope.alreadySure;
						}
					}
				});

				modalInstance.result.then(function (info) {
					$scope.alreadySure = info.alreadySure;
					$scope.calculateWeapons();
				}, function () {
					return;
				});
			} else {
				$scope.calculateWeapons();
			}
		}

		$scope.calculateWeapons = function() {
			if ($scope.weaponNum > 500) {
				$scope.weaponNum = 500;
			}
			console.log("calculating with " + $scope.weaponNum);
			var currentSeed = $scope.seed_weapon;
			for (var i in $scope.current_weapons) {
				$scope.current_weapons[i].a = $scope.current_weapons[i].n;
			}

			$scope.w_steps =[];
			for (var i = 0; i < $scope.weaponNum; i++) {
				if (currentSeed == 0) {
					console.log("gg");
				}
				var random = new Random(currentSeed);
				var nextSeed = random.next(1, 2147483647);
				var weapon = random.next(1, 34);

				var before = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));
				$scope.current_weapons[weapon-1].a += 1;
				var after = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));
				var cssclass = before == after ? (weapon == 33 ? "darklord" : "") : "newset";
				$scope.w_steps.push({
					index: i + 1,
					seed: currentSeed,
					weapon: heroToName[weapon],
					wi: weapon - 1,
					typeclass: cssclass
				});
				currentSeed = nextSeed;
			}

			$scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
			$scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));

			calculateColumns();

		};


		$scope.$on('stateUpdate', function() {
			// TODO: update from rootScope.state
		});
	}
);