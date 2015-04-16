yattoApp.controller('CalculatorController',
	function($scope, $http) {
		var something = "something";
		$scope.steps = "steps";
		
		// re-ordering http://codepen.io/SimeonC/pen/AJIyC


		$scope.artifacts = [
			{name: "Amulet of the Valrunes",  index: 0, value: 0},
			{name: "Axe of Resolution",       index: 1, value: 0},
			{name: "Barbarian's Mettle",      index: 2, value: 0},
			{name: "Chest of Contentment",    index: 3, value: 0},
			{name: "Crafter's Elixir",        index: 4, value: 0},
			{name: "Crown Egg",               index: 5, value: 0},
			{name: "Dark Cloak of Life",      index: 6, value: 0},
			{name: "Death Seeker",            index: 7, value: 0},
			{name: "Divine Chalice",          index: 8, value: 0},
			{name: "Drunken Hammer",          index: 9, value: 0},
			{name: "Future's Fortune",        index: 10, value: 0},
			{name: "Hero's Thrust",           index: 11, value: 0},
			{name: "Hunter's Ointment",       index: 12, value: 0},
			{name: "Knight's Shield",         index: 13, value: 0},
			{name: "Laborer's Pendant",       index: 14, value: 0},
			{name: "Ogre's Gauntlet",         index: 15, value: 0},
			{name: "Otherworldly Armor",      index: 16, value: 0},
			{name: "Overseer's Lotion",       index: 17, value: 0},
			{name: "Parchment of Importance", index: 18, value: 0},
			{name: "Ring of Opulence",        index: 19, value: 0},
			{name: "Ring of Wondrous Charm",  index: 20, value: 0},
			{name: "Sacred Scroll",           index: 21, value: 0},
			{name: "Saintly Shield",          index: 22, value: 0},
			{name: "Savior Shield",           index: 23, value: 0},
			{name: "Tincture of the Maker",   index: 24, value: 0},
			{name: "Undead Aura",             index: 25, value: 0},
			{name: "Universal Fissure",       index: 26, value: 0},
			{name: "Warrior's Revival",       index: 27, value: 0},
			{name: "Worldly Illuminator",     index: 28, value: 0}];

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

		$scope.customizations = [
			{name: "All Damage",      index: 0, value: 0},
			{name: "Critical Damage", index: 1, value: 0},
			{name: "Gold Dropped",    index: 2, value: 0},
			{name: "Chest Gold",      index: 3, value: 0},
			{name: "Critical Chance", index: 4, value: 0},
			{name: "Tap Damage",      index: 5, value: 0}];

		$scope.methods = [
			{name: "Gold",          index: 0, value: false},
			{name: "All Damage",    index: 1, value: false},
			{name: "Tap Damage",    index: 2, value: true},
			{name: "K",             index: 3, value: false},
			{name: "Relics/second", index: 4, value: true},
			{name: "Stages/second", index: 5, value: false}];

		$scope.relics = 0;
		$scope.nsteps = 0;
		$scope.greedy = 1;

		$scope.calculate = function() {
			console.log($scope.artifacts);
			console.log($scope.weapons);
			console.log($scope.customizations);

			var info = {"artifacts"      : $scope.artifacts, 
						"weapons" 	     : $scope.weapons, 
						"customizations" : $scope.customizations,
						"relics"         : $scope.relics,
						"nsteps"         : $scope.nsteps,
						"greedy"         : $scope.greedy}
			console.log("controller");
			console.log(info);

			$http({
				method: "POST",
				url: "test",
				data: {"info": info}
			}).success(function(data, status, headers, config) {
      			// console.log($scope.roadmaps);
      			console.log("yay stuff: " + data.content);
      			$scope.steps = data.content;
      		}).error(function(data, status, headers, config) {
      			console.log("boo error");
      		});
  		};
	}
);