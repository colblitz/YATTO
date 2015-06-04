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
					var numOwned = 29 - list.length;
					var index = $scope.unityRandom[currentSeed].values[numOwned];
					var next = list[index];
					var keep = !salvages[steps.length];

					if (keep) {
						list.splice(index, 1);
					}
					steps.push({
						index: next,
						name: artifact_info[next].name,
						salvage: !keep
					});
					currentSeed = $scope.unityRandom[currentSeed].nextSeed;
				}
			}

			$scope.steps = steps;
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
				$scope.s_artifacts[a.index].owned = a.value != 0;
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


//  0 Amulet of the Valrunes",   0 monster gold
//  1 Axe of Resolution",        1 BR duration
//  2 Barbarian's Mettle",       2 BR CDR
//  3 Chest of Contentment",     3 chesterson gold
//  4 Crafter's Elixir",         4 increase gold (multiplicative)
//  5 Crown Egg",                5 chesterson chance
//  6 Dark Cloak of Life",       6 boss life
//  7 Death Seeker",             7 crit chance
//  8 Divine Chalice",           8 chance for 10x gold
//  9 Drunken Hammer",           9 tap damage
// 10 Future's Fortune",        10 increase gold (additive)
// 11 Hero's Thrust",           11 crit damage
// 12 Hunter's Ointment",       12 WC CDR
// 13 Knight's Shield",         13 boss gold
// 14 Laborer's Pendant",       14 HoM CDR
// 15 Ogre's Gauntlet",         15 SC duration
// 16 Otherworldly Armor",      16 hero death chance
// 17 Overseer's Lotion",       17 SC CDR
// 18 Parchment of Importance", 18 CS duration
// 19 Ring of Opulence",        19 HoM duration
// 20 Ring of Wondrous Charm",  20 upgrade cost
// 21 Sacred Scroll",           21 CS CDR
// 22 Saintly Shield",          22 HS CDR
// 23 Savior Shield",           23 boss time
// 24 Tincture of the Maker",   24 all damage
// 25 Undead Aura",             25 bonus relics
// 26 Universal Fissure",       26 WR duration
// 27 Warrior's Revival",       27 revive time
// 28 Worldly Illuminator",     28 number of mobs


// 25th artifact costs 201.47k relics : parch of imprtance 3353 diamonds salvaging
// 26th cost 67k relics : futures fortune 4238 diamonds salvaging
// 27th cost 89k relics : AoV 5355 diamonds salvaging.
// i will leave them on level 1. what else do you need? i will finish this run for 28th and 29th artifact :)


// 1  120 5152
// 16  10 3860
// 28   5 3687

// 25 - 45319 - 3353
//                     26 - 63628 - 4238
// 27 - 45319 - 4567 | 27 - 63628 - 4902 | 27 - 89202 - 5355



//                                  +885
// 						+1214               + 764                +1117

// 18   1 4567
// 10   1 4902
// 0    1 5355 -

// 25 18   1  3353
// 26 10   1  4238
// 27 1  120  5152
// 27 16  10  3860
// 27 28   5  3687
// 27 0    1  5355
// 27 3  260 10493
// 27 20  25  3710
// 27 2   10  3726
// 27 13 190  6214
// 27 5  245  9697
// 27 15  95  4490
// 27 11 195  9974
// 27 4  160  8159
// 27 10   1  4902
// 27 6   25  3760
// 27 14  10  4142
// 27 18   1  4567
// 27 19  80  4504
// 27 7   25  4058
// 27 9  200  9580
// 27 24  70 11342
// 27 17  10  3695
// 27 8   70  4407
// 27 27  10  3778
// 27 26 130  5497
// 27 21  10  4321
// 27 22  10  4011
// 27 25 210 28286

// --------------

// 29 3  156  7781
// 29 22  10  5895
// 29 27  10  5918
// 29 25 141 14606
// 29 7   25  6175
// 29 19  57  6104
// 29 15  90  6444
// 29 0   27  5944
// 29 5  176  8406
// 29 17  10  5865
// 29 12  10  6391
// 29 8   33  8582
// 29 23  25  5914
// 29 6   25  5919
// 29 24  56  9351
// 29 20  25  5904
// 29 9  149  8483
// 29 11 174  8708
// 29 10  23  5935
// 29 28   5  5896
// 29 16  10  5938
// 29 1  190  9888
// 29 13 104  6558
// 29 26  99  6863
// 29 18  70  6884
// 29 4  114  8433
// 29 14  10  7782
// 29 2   10  7816


// ------



//  0 Amulet of the Valrunes",   0 monster gold
//  1 Axe of Resolution",        1 BR duration
//  4 Crafter's Elixir",         4 increase gold (multiplicative)
//  6 Dark Cloak of Life",       6 boss life
//  7 Death Seeker",             7 crit chance
//  9 Drunken Hammer",           9 tap damage
// 10 Future's Fortune",        10 increase gold (additive)
// 11 Hero's Thrust",           11 crit damage
// 12 Hunter's Ointment",       12 WC CDR
// 13 Knight's Shield",         13 boss gold
// 14 Laborer's Pendant",       14 HoM CDR
// 16 Otherworldly Armor",      16 hero death chance
// 17 Overseer's Lotion",       17 SC CDR
// 20 Ring of Wondrous Charm",  20 upgrade cost
// 22 Saintly Shield",          22 HS CDR
// 23 Savior Shield",           23 boss time
// 25 Undead Aura",             25 bonus relics
// 26 Universal Fissure",       26 WR duration
// 27 Warrior's Revival",       27 revive time


// 134
// 56
// 253932
// 207122
// 253932
// 73340
// 1107527
// 56
// 3105178
// 377742
// 537358
// 7681752
// 576
// 56
// 1161
// 278096
// 1161
// 19128
// 333857
// 209678
// 2768
// 929978
// 100
// 42
// 2203517
// 2059419
// 56
// 203227
// 576

// 28		5		5864		 	112
// 2		10		5863		59
// 15		187		9707		  259621
// 19		153		8991		207135
// 18		187		9684		257924
// 8		104		7052		74274
// 3		377		19321		1107584
// 21		10		6391		32283
// 24		118		36404		3105312
// 5		245		11445		393951
// 26		247		13318		548819
// 25		320		66445		7682166
// 27		10		8542		175189
// 12		10		6888		63684
// 20		25		5889		1600
// 13		250		9956		278295
// 23		25		5889		1600
// 7		25		5913		3054
// 1		207		10687		334155
// 10		96		9032		210108
// 6		25		5919		3399
// 4		250		17526		931329
// 14		10		5896		2047
// 22		10		6240		22919
// 11		368		29311		2211603
// 9		380		29413		2104574
// 17		10		6600		45375
// 0		95		10143		292420
// 16		10		7823		125459


// Name	Level	Salvage Cost	Relics Received
// 28		5		5864		112
// 2			10		5863		59
// 15		187		9707		259621
// 19		153		8991		207135
// 18		187		9684		257924
// 8			104		7052		74274
// 3			377		19321		1107584
// 21		10		6391		32283
// 24		118		36404		3105312
// 5			245		11445		393951
// 26		247		13318		548819
// 25		320		66445		7682166
// 27		10		8542		175189
// 12		10		6888		63684
// 20		25		5889		1600
// 13		250		9956		278295
// 23		25		5889		1600
// 7			25		5913		3054
// 1			207		10687		334155
// 10		96		9032		210108
// 6			25		5919		3399
// 4			250		17526		931329
// 14		10		5896		2047
// 22		10		6240		22919
// 11		368		29311		2211603
// 9			380		29413		2104574
// 17		10		6600		45375
// 0			95		10143		292420
// 16		10		7823		125459


// Name	Level	Salvage Cost	Relics Received
// Worldly Illuminator	5	5864	112
// Barbarian's Mettle	10	5863	59
// Ogre's Gauntlet	187	9707	259621
// Ring of Opulence	153	8991	207135
// Parchment of Importance	187	9684	257924
// Divine Chalice	104	7052	74274
// Chest of Contentment	377	19321	1107584
// Sacred Scroll	10	6391	32283
// Tincture of the Maker	118	36404	3105312
// Crown Egg	245	11445	393951
// Universal Fissure	247	13318	548819
// Undead Aura	320	66445	7682166
// Warrior's Revival	10	8542	175189
// Hunter's Ointment	10	6888	63684
// Ring of Wondrous Charm	25	5889	1600
// Knight's Shield	250	9956	278295
// Savior Shield	25	5889	1600
// Death Seeker	25	5913	3054
// Axe of Resolution	207	10687	334155
// Future's Fortune	96	9032	210108
// Dark Cloak of Life	25	5919	3399
// Crafter's Elixir	250	17526	931329
// Laborer's Pendant	10	5896	2047
// Saintly Shield	10	6240	22919
// Hero's Thrust	368	29311	2211603
// Drunken Hammer	380	29413	2104574
// Overseer's Lotion	10	6600	45375
// Amulet of the Valrunes	95	10143	292420
// Otherworldly Armor	10	7823	125459


// ----------------


// death seeker - lv 18 - 1266 diamonds
// undead aura - lv 54 - 2238 diamonds
// dark cloak of life - lv 25 - 1525 diamonds
// sacred scroll - lv 10 - 1217 diamonds
// ring of opulence - lv 27 - 1247 diamonds
// barbarian's mettle - lv 10 - 1162 diamonds
// warrior's revival - lv 10 - 1355 diamonds
// drunken hammer - lv 47 - 1394 diamonds
// worldly illuminator - lv 5 - 1154 diamonds
// knight's shield - lv 58 - 1389 diamonds
// hunter's ointment - lv 10 - 1657 diamonds
// laborer's pendant - lv 10 - 1285 diamonds
// universal fissure - lv 37 - 1349 diamonds
// hero's thrust - lv 50 - 1481 diamonds
// future's fortune - lv 12 - 1210 diamonds
// chest of contentment - lv 41 - 1298 diamonds
// ogre's gauntlet - lv 90 - 2183 diamonds
// crown egg - lv 50 - 1390 diamonds
// crafter's elixir - lv 42 - 1368 diamonds
// tincture of the maker - lv 22 - 1468 diamonds
// overseer's lotion - lv 10 - 1217 diamonds
// otherworldly armor - lv 10 - 1430 diamonds