yattoApp.controller('SequencerController',
	function($scope, shareVariables, localStorageService) {

		var processData = function(data) {
			$scope.unityRandom = [];
			for (var i in data) {
				$scope.unityRandom.push({
					nextSeed: parseInt(data[i][1]),
					values: data[i].slice(2).map(Number)
				});
			}
		};

		$.ajax({
			url: "../../artifact_order_public - Random.csv",
			async: false,
			dataType: "text",
			success: function(data) {
				processData($.csv2Array(data));
			}
		});

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
		}

		var setDefaults = function() {
			$scope.s_artifacts = [];
			$scope.order_list = [];
			$scope.list = [];
			$scope.seed = 0;

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

		$scope.getList = function(reset, slist) {
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

			while (list.length > 0) {
				if (list.length == 1) {
					var next = list[0];
					steps.push({
						index: next,
						name: artifact_info[next].name
					});
					list = [];
				} else {

					// console.log("list: " + list);
					// console.log("current seed: " + currentSeed);

					var numOwned = 29 - list.length;
					// console.log("num owned: " + numOwned);

					var index = $scope.unityRandom[currentSeed].values[numOwned];
					// console.log("index: " + index);

					// var next = list.splice(index, 1)[0];
					var next = list[index];
					if (salvages[steps.length]) {

					// 	console.log("at point of salvage");
					// 	console.log(steps.length);
					// 	console.log($scope.steps[steps.length]);
					// 	console.log("vs");
					// 	console.log({
					// 	index: next,
					// 	name: artifact_info[next].name,
					// 	salvage: false
					// });
					// 	console.log(steps[steps.length-1]);
					// 	console.log("----------------");
					// 	console.log(artifact_info[next].name);
					// 	console.log($scope.steps);
					// 	console.log(steps);

					// 	steps.push($scope.steps[steps.length]);
						steps.push({
							index: next,
							name: artifact_info[next].name,
							salvage: true
						});
						currentSeed = $scope.unityRandom[currentSeed].nextSeed;
						continue;
					} else {
						list.splice(index, 1);
					}

					// console.log(artifact_info[next].name);
					steps.push({
						index: next,
						name: artifact_info[next].name,
						salvage: false
					});
					currentSeed = $scope.unityRandom[currentSeed].nextSeed;
				}
			}

			$scope.steps = steps;
		};


		// Random.seed = this.nextArtifactSeed;
		// int removeat;
		// string s = "";
		// int id = 0;

		// foreach(Transform t in resultPanel.transform)
		// {
		// 	Destroy(t.gameObject);
		// }

		// while(list.Count>0)
		// {
		// 	removeat = Random.Range(0, list.Count);
		// 	GameObject art = GameObject.Instantiate(resultPrefab) as GameObject;
		// 	//art.gameObject.transform.parent = resultPanel;
		// 	art.transform.SetParent(resultPanel.transform,false);
		// 	art.GetComponent<SavageArtifact>().SetValues(id,list[removeat]);
		// 	if(!idsToSavage.Contains(id))
		// 		list.RemoveAt(removeat);
		// 	else
		// 		art.GetComponent<SavageArtifact>().Savaged();
		// 	Random.seed = Random.Range(1, 10000);
		// 	id++;
		// }
		// resultField.text = s;










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
				// $scope.s_artifacts[a.index].owned = a.value != 0;
			}

			// for (var i in $scope.r_artifacts) {
			// 	$scope.calcArtifacts(i);
			// }
		};

		$scope.stateChanged = function(reset) {
			$scope.getList(reset, null);
		};

		$scope.initialize();
		$scope.getList(true, null);
	}
);