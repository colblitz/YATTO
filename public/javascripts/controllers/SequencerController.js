yattoApp.controller('SequencerController',
	function($scope, shareVariables, localStorageService) {

		// var processData = function(data) {
		// 	$scope.unityRandom = [];
		// 	for (var i in data) {
		// 		$scope.unityRandom.push({
		// 			nextSeed: parseInt(data[i][1]),
		// 			values: data[i].slice(2).map(Number)
		// 		});
		// 	}
		// };

		// $.ajax({
		// 	url: "../../artifact_order_public - Random.csv",
		// 	async: false,
		// 	dataType: "text",
		// 	success: function(data) {
		// 		processData($.csv2Array(data));
		// 	}
		// });

		var getOrderList = function() {
			return [
				13, // Knight's Shield
				 0, // Amulet of the Valrunes
				 6, // Dark Cloak of Life
				 7, // Death Seeker
				23, // Savior Shield
				17, // Overseer's Lotion
				21, // Sacred Scroll
				12, // Hunter's Ointment
				14, // Laborer's Pendant
				 2, // Barbarian's Mettle
				22, // Saintly Shield
				15, // Ogre's Gauntlet
				18, // Parchment of Importance
				26, // Universal Fissure
				19, // Ring of Opulence
				 1, // Axe of Resolution
				11, // Hero's Thrust
				 5, // Crown Egg
				 3, // Chest of Contentment
				10, // Future's Fortune
				 8, // Divine Chalice
				25, // Undead Aura
				27, // Warrior's Revival
				20, // Ring of Wondrous Charm
				28, // Worldly Illuminator
				24, // Tincture of the Maker
				 4, // Crafter's Elixir
				16, // Otherworldly Armor
				 9  // Drunken Hammer
				];
		};

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

		// console.log(salvageCosts);

		// // TODO: make this a lookup
		// var salvageCost = function(i) {
		// 	while (i < 30) {
		// 		var aCost = costToBuy(i);
		// 		var nCost = costToBuy(i+1);
		// 		var a = (aCost + nCost) * 1;
		// 		salvageCosts[i] = Math.round(Math.pow(5, Math.log(a) / Math.log(10)) + 35);
		// 	}
		// };

		var setDefaults = function() {
			$scope.s_artifacts = [];
			$scope.w_steps = [];
			$scope.order_list = [];
			$scope.list = [];
			$scope.seed = 0;
			$scope.salvageint = 0;
			$scope.maxDiamonds = 1000;
			$scope.timer = null;
			$scope.salvageError = "";
			$scope.cost_manual = 0;
			$scope.cost_auto = 0;
			$scope.w_confirm = false;
			$scope.showWeapons = false;
			$scope.current_weapons = [];
			$scope.current_min = 0;
			$scope.after_min = 0;

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
		};

		// var start = new Date();
		// var a = possibleSalvages(0, 1000);
		// var end = new Date();
		// console.log("done: " + a.length);
		// console.log("took: " + (end - start));
		// for (var k in a) {
		// 	console.log(k);
		// }

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
			// console.log("getting list");
			var steps = [];
			var currentSeed = $scope.seed;
			var list = getOrderList().filter(function(x) {
				return !$scope.s_artifacts[x].owned;
			});

			var salvages = [];
			if (!reset && typeof $scope.steps !== "undefined" && $scope.steps != null) {
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

			// console.log(steps.map(function(s) { return s.index; }));
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

		$scope.resetSearch = function() {
			console.log("resetting");
			clearInterval($scope.timer);
			$scope.salvageint = 0;
			$scope.salvageError = "";
			$scope.best_steps = null;
			$scope.best_score = 0;
		};

		$scope.best_steps = [];
		$scope.best_score = 0;

		var startSearching = function() {
			$scope.$apply(function() {
				$scope.salvageint += 1;
				var tryList = intToSalvage($scope.salvageint);
				var cost = getCostOfSalvages(getOwned(), tryList);
				if (cost < $scope.maxDiamonds) {
					var a = $scope.getList(false, tryList);
					var f = a.filter(function(step) { return !step.salvage; }).map(function(step) { return step.index; });
					// console.log(f);
					// console.log("a: " + a);
					var newScore = scoreAList(f);
					// console.log("newScore: " + newScore);
					if (newScore > $scope.best_score) {
						console.log("  --------- new best score: " + newScore);
						$scope.best_score = newScore;
						$scope.best_steps = a;
						$scope.cost_auto = cost;
					}
				} else {
					console.log("too much");
				}
			});
		};


		$scope.start = function() {
			if ($scope.s_artifacts.map(function(a) { return a.priority; })
													  .reduce(function(a, b) { return a + b; }, 0) == 0) {
				$scope.salvageError = "Need to set priorities!";
			} else {
				$scope.timer = setInterval(startSearching, 0);
			}
		};

		$scope.stop = function() {
			clearInterval($scope.timer);
		};

		// var possibleSalvages = function(owned, cost) {
		// 	console.log("----------------------------------------------------------------------------");
		// 	var possible = {};
		// 	possible[[]] = true;
		// 	var added = [[]];
		// 	var done = false;
		// 	while (!done) {
		// 		if (added.length == 0) {
		// 			break;
		// 		}

		// 		var seed = added.slice();
		// 		added = [];


		// 		for (var s in seed) {
		// 			var t1 = seed[s].slice();
		// 			var t2 = seed[s].slice();
		// 			t1.push(true);
		// 			if (getCostOfSalvages(owned, t1) < cost) {
		// 				t2.push(false);
		// 				added.push(t1);
		// 				added.push(t2);
		// 			}
		// 		}
		// 		if (added.length == 0) {
		// 			done = true;
		// 		}

		// 		for (var a in added) {
		// 			if (added[a][added[a].length - 1]) {
		// 				possible[added[a]] = true;
		// 			}
		// 		}

		// 		console.log(Object.keys(possible).length);
		// 	}
		// 	return possible;
		// };


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
			return artifacts;
		};


		$scope.importWFromString = function(state) {
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

			var weapons = [];
			t[1].split(",").forEach(function(h, i, array) {
				var v = h.split(".");
				weapons.push(parseOrZero(v[1], parseInt));
			});
			return weapons;
		};

		var heroToName = {
			 1: "Takeda",
			 2: "Contessa",
			 3: "Hornetta",
			 4: "Mila",
			 5: "Terra",
			 6: "Inquisireaux",
			 7: "Charlotte",
			 8: "Jordaan",
			 9: "Jukka",
			10: "Milo",
			11: "Macelord",
			12: "Gertrude",
			13: "Twitterella",
			14: "Master Hawk",
			15: "Elpha",
			16: "Poppy",
			17: "Skulptor",
			18: "Sterling",
			19: "Orba",
			20: "Remus",
			21: "Mikey",
			22: "Peter",
			23: "Teeny Tom",
			24: "Deznis",
			25: "Hamlette",
			26: "Eistor",
			27: "Flavius",
			28: "Chester",
			29: "Mohacas",
			30: "Jaqulin",
			31: "Pixie",
			32: "Jackalope",
			33: "Dark Lord"
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
				$scope.s_artifacts[a.index].owned = a.value != 0;
			}


			var weapons = [];
			// get from calculator controller
			if (shareVariables.hasVariable("weapons")) {
				weapons = shareVariables.getVariable("weapons");
			} else {
				// try getting from cookies
				var state = localStorageService.get('state')
				if (typeof state !== "undefined" && state != null) {
					weapons = $scope.importWFromString(state);
				}
			}
			$scope.current_weapons = [];
			console.log(weapons);
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


			// for (var i in $scope.r_artifacts) {
			// 	$scope.calcArtifacts(i);
			// }
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
			$scope.w_confirm = true;
		};

		$scope.getWeapons = function() {
			$scope.showWeapons = true;
		};


		$scope.c = [0, 1, 2, 3];
		$scope.columns = [];
		$scope.columnCount = 4;

		var calculateColumns = function() {
			var itemsPerColumn = Math.ceil($scope.w_steps.length / $scope.columnCount);
			$scope.columns = [];
			$scope.columns.push($scope.w_steps.slice(0, itemsPerColumn));
			$scope.columns.push($scope.w_steps.slice(itemsPerColumn, itemsPerColumn*2));
			$scope.columns.push($scope.w_steps.slice(itemsPerColumn*2, itemsPerColumn*3));
			$scope.columns.push($scope.w_steps.slice(itemsPerColumn*3));

			console.log($scope.columns);

			// var a = $scope.w_steps.slice(0, itemsPerColumn);



			// $scope.columns.push({
			// 	steps: a
			// });
			// a = $scope.w_steps.slice(itemsPerColumn, itemsPerColumn);
			// $scope.columns.push({
			// 	steps: a
			// });
			// a = $scope.w_steps.slice(itemsPerColumn*2, itemsPerColumn);
			// $scope.columns.push({
			// 	steps: a
			// });
			// a = $scope.w_steps.slice(itemsPerColumn*3, itemsPerColumn);
			// $scope.columns.push({
			// 	steps: a
			// });

			// for (var i = 0; i < $scope.w_steps.length; i += itemsPerColumn) {
			// 	var col = {
			// 		start: i,
			// 		end: Math.min(i + itemsPerColumn, $scope.w_steps.length)
			// 	};
			// 	$scope.columns.push(col);
			// }
		};

		$scope.weaponChanged = function() {
			var currentSeed = $scope.weaponSeed;
			// console.log($scope.weaponSeed);
			// console.log(currentSeed);
			for (var i in $scope.current_weapons) {
				$scope.current_weapons[i].a = $scope.current_weapons[i].n;
			}

			$scope.w_steps =[];
			for (var i = 0; i < $scope.weaponNum; i++) {
				// console.log(i);
				if (currentSeed == 0) {
					console.log("gg");
				}
				// console.log("current seed: " + currentSeed);
				var random = new Random(currentSeed);
				var nextSeed = random.next(1, 2147483647);
				var weapon = random.next(1, 34);

				// console.log("next seed: " + nextSeed);
				// console.log("weapon: " + weapon);

				$scope.w_steps.push({
					index: i + 1,
					seed: currentSeed,
					weapon: heroToName[weapon]
				});
				$scope.current_weapons[weapon-1].a += 1;
				currentSeed = nextSeed;
			}

			$scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
			$scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));


			calculateColumns();

		};



// | slice:column.start:column.end

// <ul ng-repeat="column in columns" class="small-12 medium-4 columns">
//       <li ng-repeat="skill in skills | slice:column.start:column.end">
//         {{ skill }}
//       </li>
//     </ul>
//   </body>


//     $scope.columns = [];
//   $scope.columnCount = 2;

//   function calculateColumns() {
//     var itemsPerColumn = Math.ceil($scope.skills.length / $scope.columnCount);
//     for (var i=0; i<$scope.skills.length; i += itemsPerColumn) {
//       var col = {start:i, end: Math.min(i + itemsPerColumn, $scope.skills.length) };
//        $scope.columns.push(col);
//     }
//   }

//   calculateColumns();

// var string = "";
// string += "1911545348";
// string += ",";
// string += random.next(1, 2147483647).toString();
// string += ",";
// string += random.next(1, 34).toString();
// console.log(string);



// private HeroID GetHeroToWeaponUpgrade()
// {
//     if (this.heroSeed == 0)
//     {
//         this.heroSeed = Random.Range(1, 0x7fffffff);
//     }
//     Random random = new Random((int) this.heroSeed);
//     this.heroSeed = random.Next(1, 0x7fffffff);
//     return (HeroID) random.Next(1, 0x22);
// }



			// $scope.steps = steps;
			// return steps.map(function(s) { return s.index; });




	}
);

