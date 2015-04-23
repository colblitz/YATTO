yattoApp.controller('CalculatorController',
	function($scope, $http, $cookies, $cookieStore) {
		$scope.sortableOptions = {
			'ui-floating': false,
			'axis': 'y',
			'containment': "parent",
			'handle': '> .myHandle',
		};

		$scope.steps = [];
		$scope.summary_steps = [];
		$("#step-tabs").tabs();

		$scope.artifacts = [
			{name: "Amulet of the Valrunes",  index: 0, value: 1},
			{name: "Axe of Resolution",       index: 1, value: 1},
			{name: "Barbarian's Mettle",      index: 2, value: 1},
			{name: "Chest of Contentment",    index: 3, value: 1},
			{name: "Crafter's Elixir",        index: 4, value: 1},
			{name: "Crown Egg",               index: 5, value: 1},
			{name: "Dark Cloak of Life",      index: 6, value: 1},
			{name: "Death Seeker",            index: 7, value: 1},
			{name: "Divine Chalice",          index: 8, value: 1},
			{name: "Drunken Hammer",          index: 9, value: 1},
			{name: "Future's Fortune",        index: 10, value: 1},
			{name: "Hero's Thrust",           index: 11, value: 1},
			{name: "Hunter's Ointment",       index: 12, value: 1},
			{name: "Knight's Shield",         index: 13, value: 1},
			{name: "Laborer's Pendant",       index: 14, value: 1},
			{name: "Ogre's Gauntlet",         index: 15, value: 1},
			{name: "Otherworldly Armor",      index: 16, value: 1},
			{name: "Overseer's Lotion",       index: 17, value: 1},
			{name: "Parchment of Importance", index: 18, value: 1},
			{name: "Ring of Opulence",        index: 19, value: 1},
			{name: "Ring of Wondrous Charm",  index: 20, value: 1},
			{name: "Sacred Scroll",           index: 21, value: 1},
			{name: "Saintly Shield",          index: 22, value: 1},
			{name: "Savior Shield",           index: 23, value: 1},
			{name: "Tincture of the Maker",   index: 24, value: 1},
			{name: "Undead Aura",             index: 25, value: 1},
			{name: "Universal Fissure",       index: 26, value: 1},
			{name: "Warrior's Revival",       index: 27, value: 1},
			{name: "Worldly Illuminator",     index: 28, value: 1}];

		$scope.weapons = [
			{name: "Takeda the Blade Assassin",       index: 0, value: 0},
			{name: "Contessa the Torch Wielder",      index: 1, value: 0},
			{name: "Hornetta, Queen of the Valrunes", index: 2, value: 0},
			{name: "Mila the Hammer Stomper",         index: 3, value: 0},
			{name: "Terra the Land Scorcher",         index: 4, value: 0},
			{name: "Inquisireaux the Terrible",       index: 5, value: 0},
			{name: "Charlotte the Special",           index: 6, value: 0},
			{name: "Jordaan, Knight of Mini",         index: 7, value: 0},
			{name: "Jukka, Master of Axes",           index: 8, value: 0},
			{name: "Milo and Clonk-Clonk",            index: 9, value: 0},
			{name: "Macelord the Ruthless",           index: 10, value: 0},
			{name: "Gertrude the Goat Rider",         index: 11, value: 0},
			{name: "Twitterella the Tweeter",         index: 12, value: 0},
			{name: "Master Hawk, Lord of Luft",       index: 13, value: 0},
			{name: "Elpha, Wielder of Gems",          index: 14, value: 0},
			{name: "Poppy, Daughter of Ceremony",     index: 15, value: 0},
			{name: "Skulptor, Protector of Bridges",  index: 16, value: 0},
			{name: "Sterling the Enchantor",          index: 17, value: 0},
			{name: "Orba the Foreseer",               index: 18, value: 0},
			{name: "Remus the Noble Archer",          index: 19, value: 0},
			{name: "Mikey the Magician Apprentice",   index: 20, value: 0},
			{name: "Peter Pricker the Prickly Poker", index: 21, value: 0},
			{name: "Teeny Tom, Keeper of the Castle", index: 22, value: 0},
			{name: "Deznis the Cleanser",             index: 23, value: 0},
			{name: "Hamlette, Painter of Skulls",     index: 24, value: 0},
			{name: "Eistor the Banisher",             index: 25, value: 0},
			{name: "Flavius and Oinksbjorn",          index: 26, value: 0},
			{name: "Chester the Beast Tamer",         index: 27, value: 0},
			{name: "Mohacas the Wind Warrior",        index: 28, value: 0},
			{name: "Jaqulin the Unknown",             index: 29, value: 0},
			{name: "Pixie the Rebel Fairy",           index: 30, value: 0},
			{name: "Jackalope the Fireballer",        index: 31, value: 0},
			{name: "Dark Lord, Punisher of All",      index: 32, value: 0}];
		$scope.wprobability = 0;

		$scope.customizations = [
			{name: "All Damage",      index: 0, value: 0},
			{name: "Critical Damage", index: 1, value: 0},
			{name: "Gold Dropped",    index: 2, value: 0},
			{name: "Chest Gold",      index: 3, value: 0},
			{name: "Critical Chance", index: 4, value: 0},
			{name: "Tap Damage",      index: 5, value: 0}];

		$scope.methods = [
			{name: "Gold",          index: 0, value: true, tabname: "Gold"},
			{name: "All Damage",    index: 1, value: false, tabname: "ADmg"},
			{name: "Tap Damage",    index: 2, value: true,  tabname: "TDmg"},
			{name: "K",             index: 3, value: true, tabname: "  K  "},
			{name: "Relics/second (experimental!)", index: 4, value: false, tabname: " R/s "},
			{name: "Stages/second (experimental!)", index: 5, value: false, tabname: " S/s "}];

		$scope.relics = 50;
		$scope.nsteps = 10;
		$scope.greedy = 1;

		var readFromCookies = function() {
			console.log("reading from cookies");
			var cookie_a = $cookieStore.get('artifacts');
			var cookie_w = $cookieStore.get('weapons');
			var cookie_c = $cookieStore.get('customizations');
			var cookie_m = $cookieStore.get('methods');
			var cookie_s = $cookieStore.get('steps');
			var cookie_ss = $cookieStore.get('summary');
			if (typeof cookie_a !== "undefined") {
				$scope.artifacts = cookie_a;
			}
			if (typeof cookie_w !== "undefined") {
				$scope.weapons = cookie_w;
			}
			if (typeof cookie_c !== "undefined") {
				$scope.customizations = cookie_c;
			}
			if (typeof cookie_m !== "undefined") {
				$scope.methods = cookie_m;
			}
			if (typeof cookie_s !== "undefined") {
				$scope.steps = cookie_s;
			}
			if (typeof cookie_ss !== "undefined") {
				$scope.summary_steps = cookie_ss;
			}
		};

		readFromCookies();

		var storeToCookies = function() {
			console.log("storing to cookies");
			$cookieStore.put('artifacts', $scope.artifacts);
			$cookieStore.put('weapons', $scope.weapons);
			$cookieStore.put('customizations', $scope.customizations);
			$cookieStore.put('methods', $scope.methods);
			$cookieStore.put('steps', $scope.steps);
			$cookieStore.put('summary', $scope.summary_steps);
		};

		$scope.clearAllCookies = function() {
			console.log("clearing cookies");
			$cookieStore.remove("artifacts");
			$cookieStore.remove("weapons");
			$cookieStore.remove("customizations");
			$cookieStore.remove("methods");
			$cookieStore.remove("steps");
			$cookieStore.remove("summary");
		};

		var transformScopeArray = function(scopeArray) {
			var newArray = newZeroes(scopeArray.length);
			for (var x in scopeArray) {
				var thing = scopeArray[x];
				newArray[thing.index] = thing.value;
			}
			return newArray;
		}

		$scope.calculate = function() {
			var artifacts = transformScopeArray($scope.artifacts);
			var weapons = transformScopeArray($scope.weapons);
			var customizations = transformScopeArray($scope.customizations);
			var methods = [];
			for (var m in $scope.methods) {
				if ($scope.methods[m].value) {
					methods.push($scope.methods[m].index);
				}
			}

			var response = get_steps(artifacts, weapons, customizations, methods, $scope.relics, $scope.nsteps, $scope.greedy);

			for (var m in response) {
				$scope.steps[m] = response[m]["steps"];
				$scope.summary_steps[m] = response[m]["summary"];
			}

			storeToCookies();
		};

		$scope.weaponProbability = function() {
			var weapons = transformScopeArray($scope.weapons);
			console.log("p: " + weapons);
			calculate_weapons_probability(weapons);
			// do chi square

			// console.log("controller - weapon probability");
			// var weapon_list = Array.apply(null, new Array($scope.weapons.length)).map(Number.prototype.valueOf,0);
			// console.log("scope weapons is: ");
			// console.log($scope.weapons);
			// for (var weapon in $scope.weapons) {
			// 	var w = $scope.weapons[weapon];
			// 	weapon_list[w["index"]] = w["value"];
			// }
			// console.log("sending: " + weapon_list);
			// $http({
			// 	method: "POST",
			// 	url: "wprobability",
			// 	data: {"weapons": weapon_list}
			// }).success(function(data, status, headers, config) {
			// 	console.log("response: " + data.content);
			// 	$scope.wprobability = data.content;
			// }).error(function(data, status, headers, config) {
			// 	console.log("w probability error");
			// });
		};

		$scope.step = function(summary, method, stepindex) {
			console.log(method);
			console.log(stepindex);
			var step = summary ? $scope.summary_steps[method][stepindex] : $scope.steps[method][stepindex];
			console.log(step);
			for (var a in $scope.artifacts) {
				var artifact = $scope.artifacts[a];
				if (artifact.index == step.index) {
					artifact.value = step.level;
					$scope.relics -= step.cost;
					break;
				}
			}
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

			// TODO: impact on other methods (grey out?)

			storeToCookies();
		};
	}
);