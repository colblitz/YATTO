var Artifact = function(name, ad0, adpl, levelcap, cost) {
	this.name = name;
	this.ad0 = ad0;
	this.adpl = adpl;
	this.levelcap = levelcap;
	if (this.levelcap == 0) {
		this.levelcap = Infinity;
	}
	this.cost = cost;

	this.getAD = function(level) {
		if (level == 0) {
			return 0;
		} else {
			return ad0 + adpl * (level - 1);
		}
	};

	this.costToLevel = function(level) {
		if (level == 0 || level >= this.levelcap) {
			return Infinity;
		} else {
			return Math.round(this.cost(level + 1)); // TODO: Check if round or floor
		}
	};
}

var artifact_info = [
	new Artifact("Amulet of the Valrunes",   50,  25,  0, function(x) { return 0.7*Math.pow(x, 2.0); }), //  0 monster gold
	new Artifact("Axe of Resolution",        70,  35,  0, function(x) { return 0.5*Math.pow(x, 1.7); }), //  1 BR duration
	new Artifact("Barbarian's Mettle",       70,  35, 10, function(x) { return 0.4*Math.pow(x, 1.5); }), //  2 BR CDR
	new Artifact("Chest of Contentment",     40,  20,  0, function(x) { return     Math.pow(x, 1.5); }), //  3 chesterson gold
	new Artifact("Crafter's Elixir",         40,  20,  0, function(x) { return 0.5*Math.pow(x, 1.8); }), //  4 increase gold (multiplicative)
	new Artifact("Crown Egg",                40,  20,  0, function(x) { return     Math.pow(x, 1.5); }), //  5 chesterson chance
	new Artifact("Dark Cloak of Life",       30,  15, 25, function(x) { return 0.5*Math.pow(x, 2.0); }), //  6 boss life
	new Artifact("Death Seeker",             30,  15, 25, function(x) { return 0.8*Math.pow(x, 2.5); }), //  7 crit chance
	new Artifact("Divine Chalice",           30,  15,  0, function(x) { return 0.7*Math.pow(x, 1.7); }), //  8 chance for 10x gold
	new Artifact("Drunken Hammer",           60,  30,  0, function(x) { return 0.6*Math.pow(x, 1.7); }), //  9 tap damage
	new Artifact("Future's Fortune",         30,  15,  0, function(x) { return 0.7*Math.pow(x, 2.0); }), // 10 increase gold (additive)
	new Artifact("Hero's Thrust",            30,  15,  0, function(x) { return 0.7*Math.pow(x, 1.7); }), // 11 crit damage
	new Artifact("Hunter's Ointment",       120,  60, 10, function(x) { return 0.4*Math.pow(x, 1.5); }), // 12 WC CDR
	new Artifact("Knight's Shield",          60,  30,  0, function(x) { return 0.7*Math.pow(x, 1.5); }), // 13 boss gold
	new Artifact("Laborer's Pendant",        70,  35, 10, function(x) { return 0.7*Math.pow(x, 1.5); }), // 14 HoM CDR
	new Artifact("Ogre's Gauntlet",          70,  35,  0, function(x) { return 0.5*Math.pow(x, 1.7); }), // 15 SC duration
	new Artifact("Otherworldly Armor",       70,  35, 10, function(x) { return     Math.pow(x, 2.2); }), // 16 hero death chance
	new Artifact("Overseer's Lotion",        70,  35, 10, function(x) { return 0.4*Math.pow(x, 1.5); }), // 17 SC CDR
	new Artifact("Parchment of Importance",  70,  35,  0, function(x) { return 0.5*Math.pow(x, 1.7); }), // 18 CS duration
	new Artifact("Ring of Opulence",         70,  35,  0, function(x) { return 0.7*Math.pow(x, 1.7); }), // 19 HoM duration
	new Artifact("Ring of Wondrous Charm",   30,  15, 25, function(x) { return 0.5*Math.pow(x, 1.7); }), // 20 upgrade cost
	new Artifact("Sacred Scroll",            70,  35, 10, function(x) { return 0.4*Math.pow(x, 1.5); }), // 21 CS CDR
	new Artifact("Saintly Shield",           70,  35, 10, function(x) { return 0.3*Math.pow(x, 1.5); }), // 22 HS CDR
	new Artifact("Savior Shield",            30,  15, 25, function(x) { return 0.5*Math.pow(x, 1.7); }), // 23 boss time
	new Artifact("Tincture of the Maker",    10,   5,  0, function(x) { return 0.6*Math.pow(x, 2.5); }), // 24 all damage
	new Artifact("Undead Aura",              30,  15,  0, function(x) { return 0.7*Math.pow(x, 2.0); }), // 25 bonus relics
	new Artifact("Universal Fissure",       120,  60,  0, function(x) { return 0.5*Math.pow(x, 1.7); }), // 26 WR duration
	new Artifact("Warrior's Revival",        70,  35, 10, function(x) { return     Math.pow(x, 2.2); }), // 27 revive time
	new Artifact("Worldly Illuminator",     300, 150,  5, function(x) { return 0.6*Math.pow(x, 3.0); })  // 28 number of mobs
];


var numSkillTypes = 9;
var STYPE_HERO_DPS     = 0;
var STYPE_ALL_DAMAGE   = 1;
var STYPE_CRIT_DAMAGE  = 2;
var STYPE_TAP_DAMAGE   = 3;
var STYPE_PERCENT_DPS  = 4;
var STYPE_CHEST_GOLD   = 5;
var STYPE_GOLD_DROPPED = 6;
var STYPE_BOSS_DAMAGE  = 7;
var STYPE_CRIT_CHANCE  = 8;

var SKILL_LEVELS = [10, 25, 50, 100, 200, 400, 800, 1010, 1025, 1050, 1100, 1200, 1400, 1800];
var precompute_upgrade_cost = 6000;

var level_to_skills = function(level) {
	var eqLevel = (level > 1000 ? level - 1000 : level);
	var slevels = [10, 25, 50, 100, 200, 400, 800];
	for (var l in slevels) {
		if (eqLevel < slevels[l]) {
			return l;
		}
	}
	return 7;
}

var Hero = function(name, id, base_cost, skills) {
	this.name = name;
	this.id = id;
	this.base_cost = base_cost;
	this.base_cost10 = 10 * base_cost;
	this.skills = skills;
	this.upgrade_costs = [base_cost];
	for (var i = 1; i < precompute_upgrade_cost; i++) {
		this.upgrade_costs.push((i < 1000 ? this.base_cost : this.base_cost10) * Math.pow(1.075, i));
	}
	this.evolve_cost = 10.75 * this.upgrade_costs[999] // TODO: check this

	this.get_upgrade_cost = function(level) {
		if (level < precompute_upgrade_cost) {
			return this.upgrade_costs[level];
		}
		return (i < 1000 ? this.base_cost : this.base_cost10) * Math.pow(1.075, i);
	};

	this.cost_to_level = function(start_level, end_level) {
		if (end_level == start_level + 1) {
			return this.get_upgrade_cost(start_level);
		}
		if (end_level <= 1000) {
			return this.base_cost * (Math.pow(1.075, end_level) - Math.pow(1.075, start_level)) / 0.075;
		}
		if (start_level >= 1000) {
			return this.base_cost10 * (Math.pow(1.075, end_level) - Math.pow(1.075, start_level)) / 0.075;
		}
		return this.cost_to_level(start_level, 1000) + this.evolve_cost + this.cost_to_level(1000, end_level);
	};

	this.cost_to_next_skill = []
	for (var i = 0; i < 2000; i++) {
		for (var l in SKILL_LEVELS) {
			if (i < SKILL_LEVELS[l]) {
				this.cost_to_next_skill.push(this.cost_to_level(i, SKILL_LEVELS[l]));
				break;
			}
		}
	}

	this.cost_to_buy_skill = function(level) {
		if (level < 1000) {
			return 5 * this.get_upgrade_cost(level + 1);
		}
		return 0.5 * this.get_upgrade_cost(level + 1);
	};


	this.get_cost_to_next_skill = function(level) {
		for (var l in SKILL_LEVELS) {
			if (level < SKILL_LEVELS[l]) {
				return [SKILL_LEVELS[l], this.cost_to_next_skill[level]];
			}
		}
		return [0, Infinity];
	};

	this.get_bonuses = function(level, stype) {
		var bonus = 0;
		for (var i = 0; i < level_to_skills(level); i++) {
			if (skills[i][1] == stype) {
				bonus += skills[i][0];
			}
		}
		return bonus;
	};

	this.get_base_damage = function(level) {
		// source: https://github.com/oLaudix/oLaudix.github.io/blob/master/TTcalc.html
		if (level >= 1001) {
			var n1 = Math.pow(0.904, level - 1001) * Math.pow(0.715, this.id + 30);
			return ((this.get_upgrade_cost(level - 1) * (Math.pow(1.075, level - 1000) - 1) / 1.075) - 1) * n1 * 0.1;
		} else {
			var n1 = Math.pow(0.904, level - 1) * Math.pow(1 - (0.019 * Math.min(this.id, 15)), this.id);
			return this.get_upgrade_cost(level - 1) * (Math.pow(1.075, level) - 1) / 0.0075 * n1;
		}
	};
}

var hero_info = [
	new Hero("Takeda the Blade Assassin", 1, 50, [
		[0.50, STYPE_HERO_DPS], [1.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.10, STYPE_CRIT_DAMAGE], 
		[10.00, STYPE_HERO_DPS], [0.25, STYPE_ALL_DAMAGE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Contessa the Torch Wielder", 2, 175, [
		[0.05, STYPE_TAP_DAMAGE], [1.00, STYPE_HERO_DPS], [10.00, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS],
		[0.10, STYPE_ALL_DAMAGE], [0.10, STYPE_GOLD_DROPPED], [100.00, STYPE_HERO_DPS]]),
	new Hero("Hornetta, Queen of the Valrunes", 3, 674, [
		[1.50, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_ALL_DAMAGE], [0.004, STYPE_PERCENT_DPS], 
		[0.20, STYPE_CHEST_GOLD], [0.01, STYPE_CRIT_CHANCE], [0.30, STYPE_ALL_DAMAGE]]),
	new Hero("Mila the Hammer Stomper", 4, 2.85e3, [
		[1.00, STYPE_HERO_DPS], [8.00, STYPE_HERO_DPS], [0.06, STYPE_GOLD_DROPPED], [5.00, STYPE_HERO_DPS], 
		[0.05, STYPE_CRIT_DAMAGE], [0.20, STYPE_ALL_DAMAGE], [0.20, STYPE_CHEST_GOLD]]),
	new Hero("Terra the Land Scorcher", 5, 13.30e3, [
		[3.00, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.004, STYPE_PERCENT_DPS], [0.15, STYPE_GOLD_DROPPED], 
		[0.20, STYPE_CHEST_GOLD], [0.05, STYPE_TAP_DAMAGE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Inquisireaux the Terrible", 6, 68.10e3, [
		[2.00, STYPE_HERO_DPS], [7.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.20, STYPE_ALL_DAMAGE], 
		[0.05, STYPE_CRIT_DAMAGE], [0.02, STYPE_CRIT_CHANCE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Charlotte the Special", 7, 384.00e3, [
		[2.00, STYPE_HERO_DPS], [0.05, STYPE_BOSS_DAMAGE], [0.07, STYPE_BOSS_DAMAGE], [6.00, STYPE_HERO_DPS], 
		[0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_CHEST_GOLD], [0.30, STYPE_ALL_DAMAGE]]),
	new Hero("Jordaan, Knight of Mini", 8, 2.38e6, [
		[2.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.004, STYPE_PERCENT_DPS], [0.15, STYPE_GOLD_DROPPED], 
		[0.20, STYPE_CHEST_GOLD], [19.00, STYPE_HERO_DPS], [0.20, STYPE_ALL_DAMAGE]]),
	new Hero("Jukka, Master of Axes", 9, 23.80e6, [
		[1.50, STYPE_HERO_DPS], [0.05, STYPE_BOSS_DAMAGE], [0.30, STYPE_ALL_DAMAGE], [0.05, STYPE_CRIT_DAMAGE], 
		[50.00, STYPE_HERO_DPS], [0.25, STYPE_ALL_DAMAGE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Milo and Clonk-Clonk", 10, 143.00e6, [
		[1.50, STYPE_HERO_DPS], [0.01, STYPE_CRIT_CHANCE], [0.05, STYPE_BOSS_DAMAGE], [0.15, STYPE_GOLD_DROPPED], 
		[0.20, STYPE_CHEST_GOLD], [0.25, STYPE_CHEST_GOLD], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Macelord the Ruthless", 11, 943.00e6, [
		[2.00, STYPE_HERO_DPS], [8.50, STYPE_HERO_DPS], [0.05, STYPE_TAP_DAMAGE], [0.004, STYPE_PERCENT_DPS], 
		[0.15, STYPE_GOLD_DROPPED], [0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_GOLD_DROPPED]]),
	new Hero("Gertrude the Goat Rider", 12, 6.84e9, [
		[2.50, STYPE_HERO_DPS], [13.00, STYPE_HERO_DPS], [0.07, STYPE_BOSS_DAMAGE], [0.05, STYPE_CRIT_DAMAGE], 
		[0.004, STYPE_PERCENT_DPS], [0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_GOLD_DROPPED]]),
	new Hero("Twitterella the Tweeter", 13, 54.70e9, [
		[1.50, STYPE_HERO_DPS], [8.50, STYPE_HERO_DPS], [0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_ALL_DAMAGE], 
		[0.30, STYPE_ALL_DAMAGE], [0.05, STYPE_CRIT_DAMAGE], [120.00, STYPE_HERO_DPS]]),
	new Hero("Master Hawk, Lord of Luft", 14, 820.00e9, [
		[2.00, STYPE_HERO_DPS], [11.00, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS], [4.00, STYPE_HERO_DPS], 
		[0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_CRIT_DAMAGE], [0.20, STYPE_GOLD_DROPPED]]),
	new Hero("Elpha, Wielder of Gems", 15, 8.20e12, [
		[3.00, STYPE_HERO_DPS], [0.40, STYPE_ALL_DAMAGE], [0.05, STYPE_BOSS_DAMAGE], [0.02, STYPE_CRIT_CHANCE], 
		[0.15, STYPE_CRIT_DAMAGE], [0.20, STYPE_CHEST_GOLD], [100.00, STYPE_HERO_DPS]]),
	new Hero("Poppy, Daughter of Ceremony", 16, 164.00e12, [
		[3.50, STYPE_HERO_DPS], [0.25, STYPE_CHEST_GOLD], [0.20, STYPE_GOLD_DROPPED], [0.05, STYPE_BOSS_DAMAGE], 
		[0.07, STYPE_BOSS_DAMAGE], [0.15, STYPE_ALL_DAMAGE], [0.20, STYPE_ALL_DAMAGE]]),
	new Hero("Skulptor, Protector of Bridges", 17, 1.64e15, [
		[1.50, STYPE_HERO_DPS], [9.00, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_GOLD_DROPPED], 
		[0.05, STYPE_TAP_DAMAGE], [0.10, STYPE_CRIT_DAMAGE], [0.25, STYPE_GOLD_DROPPED]]),
	new Hero("Sterling the Enchantor", 18, 49.20e15, [
		[4.00, STYPE_HERO_DPS], [5.00, STYPE_HERO_DPS], [0.05, STYPE_BOSS_DAMAGE], [4.50, STYPE_HERO_DPS], 
		[0.05, STYPE_TAP_DAMAGE], [0.20, STYPE_CHEST_GOLD], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Orba the Foreseer", 19, 2.46e18, [
		[2.00, STYPE_HERO_DPS], [10.00, STYPE_HERO_DPS], [0.005, STYPE_PERCENT_DPS], [0.05, STYPE_TAP_DAMAGE], 
		[0.10, STYPE_ALL_DAMAGE], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_ALL_DAMAGE]]),
	new Hero("Remus the Noble Archer", 20, 73.80e18, [
		[2.50, STYPE_HERO_DPS], [6.00, STYPE_HERO_DPS], [0.20, STYPE_CRIT_DAMAGE], [4.50, STYPE_HERO_DPS], 
		[0.004, STYPE_PERCENT_DPS], [0.10, STYPE_TAP_DAMAGE], [0.10, STYPE_GOLD_DROPPED]]),
	new Hero("Mikey the Magician Apprentice", 21, 2.44e21, [
		[2.00, STYPE_HERO_DPS], [0.05, STYPE_TAP_DAMAGE], [0.30, STYPE_ALL_DAMAGE], [0.02, STYPE_CRIT_CHANCE], 
		[0.10, STYPE_ALL_DAMAGE], [0.20, STYPE_CHEST_GOLD], [100.00, STYPE_HERO_DPS]]),
	new Hero("Peter Pricker the Prickly Poker", 22, 244.00e21, [
		[2.50, STYPE_HERO_DPS], [7.50, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [5.00, STYPE_HERO_DPS], 
		[0.10, STYPE_ALL_DAMAGE], [0.30, STYPE_CRIT_DAMAGE], [0.20, STYPE_ALL_DAMAGE]]),
	new Hero("Teeny Tom, Keeper of the Castle", 23, 48.70e24, [
		[3.00, STYPE_HERO_DPS], [8.00, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS], [0.20, STYPE_CRIT_DAMAGE], 
		[0.10, STYPE_TAP_DAMAGE], [0.02, STYPE_CRIT_CHANCE], [100.00, STYPE_HERO_DPS]]),
	new Hero("Deznis the Cleanser", 24, 19.50e27, [
		[2.00, STYPE_HERO_DPS], [5.00, STYPE_HERO_DPS], [12.00, STYPE_HERO_DPS], [0.15, STYPE_GOLD_DROPPED], 
		[0.20, STYPE_CHEST_GOLD], [90.00, STYPE_HERO_DPS], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Hamlette, Painter of Skulls", 25, 21.40e30, [
		[0.05, STYPE_TAP_DAMAGE], [0.05, STYPE_TAP_DAMAGE], [0.004, STYPE_PERCENT_DPS], [0.10, STYPE_ALL_DAMAGE], 
		[0.15, STYPE_GOLD_DROPPED], [0.02, STYPE_CRIT_CHANCE], [150.00, STYPE_HERO_DPS]]),
	new Hero("Eistor the Banisher", 26, 2.36e36, [
		[3.50, STYPE_HERO_DPS], [6.50, STYPE_HERO_DPS], [0.004, STYPE_PERCENT_DPS], [0.05, STYPE_BOSS_DAMAGE], 
		[0.10, STYPE_ALL_DAMAGE], [0.05, STYPE_BOSS_DAMAGE], [0.12, STYPE_GOLD_DROPPED]]),
	new Hero("Flavius and Oinksbjorn", 27, 25.90e45, [
		[3.00, STYPE_HERO_DPS], [7.00, STYPE_HERO_DPS], [0.10, STYPE_ALL_DAMAGE], [0.05, STYPE_BOSS_DAMAGE], 
		[0.02, STYPE_CRIT_CHANCE], [0.30, STYPE_CRIT_DAMAGE], [0.20, STYPE_CHEST_GOLD]]),
	new Hero("Chester the Beast Tamer", 28, 28.50e60, [
		[3.50, STYPE_HERO_DPS], [0.01, STYPE_ALL_DAMAGE], [4.00, STYPE_HERO_DPS], [6.00, STYPE_HERO_DPS], 
		[0.20, STYPE_CRIT_DAMAGE], [0.02, STYPE_CRIT_CHANCE], [0.15, STYPE_ALL_DAMAGE]]),
	new Hero("Mohacas the Wind Warrior", 29, 3.14e81, [
		[3.30, STYPE_HERO_DPS], [5.50, STYPE_HERO_DPS], [0.10, STYPE_GOLD_DROPPED], [0.10, STYPE_TAP_DAMAGE], 
		[0.20, STYPE_GOLD_DROPPED], [0.10, STYPE_ALL_DAMAGE], [0.30, STYPE_GOLD_DROPPED]]),
	new Hero("Jaqulin the Unknown", 30, 3.14e96, [
		[10.00, STYPE_HERO_DPS], [0.10, STYPE_TAP_DAMAGE], [0.04, STYPE_PERCENT_DPS], [0.20, STYPE_GOLD_DROPPED], 
		[0.10, STYPE_ALL_DAMAGE], [0.20, STYPE_ALL_DAMAGE], [0.30, STYPE_ALL_DAMAGE]]),
	new Hero("Pixie the Rebel Fairy", 31, 3.76e101, [
		[9.00, STYPE_HERO_DPS], [20.00, STYPE_HERO_DPS], [0.01, STYPE_CRIT_CHANCE], [0.60, STYPE_TAP_DAMAGE], 
		[0.25, STYPE_CHEST_GOLD], [0.10, STYPE_ALL_DAMAGE], [0.15, STYPE_GOLD_DROPPED]]),
	new Hero("Jackalope the Fireballer", 32, 4.14e121, [
		[0.40, STYPE_HERO_DPS], [0.20, STYPE_HERO_DPS], [0.25, STYPE_GOLD_DROPPED], [0.60, STYPE_TAP_DAMAGE], 
		[0.02, STYPE_CRIT_CHANCE], [0.30, STYPE_ALL_DAMAGE], [0.10, STYPE_BOSS_DAMAGE]]),
	new Hero("Dark Lord, Punisher of All", 33, 4.56e141, [
		[20.00, STYPE_HERO_DPS], [0.20, STYPE_TAP_DAMAGE], [0.01, STYPE_PERCENT_DPS], [0.25, STYPE_GOLD_DROPPED], 
		[0.20, STYPE_ALL_DAMAGE], [0.30, STYPE_ALL_DAMAGE], [0.40, STYPE_ALL_DAMAGE]])];

var all_damage = function(artifacts) {
	var total_ad = 0;
	for (var i in artifacts) {
		total_ad += artifact_info[i].getAD(artifacts[i]);
	}
	total_ad *= (1 + 0.05 * artifacts[24]);
	return Math.round(total_ad);
};

var cost_to_buy_next = function(artifacts) {
	var owned = artifacts.filter(function(l) { return l != 0; }).length + 1;
	return Math.floor(owned * Math.pow(1.35, owned));
};

var get_hero_weapon_bonuses = function(weapons) {
	return weapons.map(function(n) { return 1 + 0.5 * n; });
};

var number_of_sets = function(weapons) {
	if (weapons.indexOf(0) > -1) {
		return 0;
	}
	return 1 + number_of_sets(weapons.map(function(n) { return n - 1; }));
};

var set_bonus = function(weapons) {
	var sets = number_of_sets(weapons);
	if (sets == 0) {
		return 1;
	} else {
		return 10 * sets;
	}
};

var next_boss_stage = function(stage) {
	// if on boss stage returns that stage, because haven't beat it yet
	return Math.floor(Math.ceil(stage * 0.2)) * 5;
};

var stage_constant = 18.5 * Math.pow(1.57, 156);
var stage_hp = function(stage) {
	if (stage <= 156) {
		return 18.5 * Math.pow(1.57, stage);
	}
	return stage_constant * Math.pow(1.17, stage - 156);
};

var log117 = Math.log(1.17);
var log157 = Math.log(1.57);
var health_to_stage = function(health) {
	if (health > stage_constant) {
		return Math.round(Math.log(health / stage_constant) / log117 + 156);
	} else {
		return Math.round(Math.log(health / 18.5) / log157);
	}
};

var base_stage_gold = function(stage) {
	return stage_hp(stage) * (0.02 + 0.00045 * Math.min(stage, 150));
};

// TODO: Check this constant
var BOSS_CONSTANT = (2 + 4*1.14 + 6*Math.pow(1.14, 2) + 7*Math.pow(1.14, 3) + 10*Math.pow(1.14, 4))/(1 + 1.14 + Math.pow(1.14, 2) + Math.pow(1.14, 3) + Math.pow(1.14, 4));

var newZeroes = function(length) {
	return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

var sumArray = function(array) {
	return array.reduce(function(a, b) { return a + b; });
};

var GameState = function(artifacts, weapons, customizations) {
	this.artifacts = artifacts.slice();
	this.a_ad = 0.01 * all_damage(this.artifacts);
	this.l_amulet = artifacts[0];
	this.l_chest = artifacts[3];
	this.l_elixir = artifacts[4];
	this.l_egg = artifacts[5];
	this.l_dseeker = artifacts[7];
	this.l_chalice = artifacts[8];
	this.l_hammer = artifacts[9];
	this.l_fortune = artifacts[10];
	this.l_hthrust = artifacts[11];
	this.l_kshield = artifacts[13];
	this.l_charm = artifacts[20];
	this.l_ua = artifacts[25];
	this.l_world = artifacts[28];
	this.main_dmg = 600 * Math.pow(1.05, 600);

	this.weapons = weapons.slice();
	this.w_bh = get_hero_weapon_bonuses(this.weapons);
	this.w_sb = set_bonus(this.weapons);

	this.customizations = customizations.slice();
	this.c_ad = customizations[0];
	this.c_cd = customizations[1];
	this.c_gd = customizations[2];
	this.c_cg = customizations[3];
	this.c_cc = customizations[4];
	this.c_td = customizations[5];

	this.c_chance = Math.min(1, 0.02 + 0.004 * this.l_egg);
	this.n_chance = 1 - this.c_chance;

	this.n_gold = 1 + 0.1 * this.l_amulet;
	this.d_chance = Math.min(1, 0.005 * this.l_chalice);
	this.d_multiplier = 1 - this.d_chance + 10 * this.d_chance;
	this.m_multiplier = this.n_chance * this.n_gold * this.d_multiplier;
	this.boss_gold = BOSS_CONSTANT * (1 + this.l_kshield);

	this.other_total = (1 + this.c_gd) * (1 + 0.15 * this.l_elixir) * (1 / (1 - 0.02 * this.l_charm));

	this.heroes = newZeroes(hero_info.length);
	this.hero_skills = newZeroes(hero_info.length);
	this.skill_bonuses = newZeroes(numSkillTypes);
	this.current_stage = 1;
	this.current_gold = 0;
	this.time = 0;

	this.new_run = function() {
		this.heroes = newZeroes(hero_info.length);
		this.hero_skills = newZeroes(hero_info.length);
		this.skill_bonuses = newZeroes(numSkillTypes);
		this.current_stage = 1;
		this.current_gold = 0;
		this.time = 0;
	};

	this.add_skill = function(h, s) {
		var skill = hero_info[h].skills[s];
		this.skill_bonuses[skill[1]] += skill[0];
	};

	this.get_all_skills = function() {
		var heroes_after = this.heroes.slice();
		for (var i = 0; i < heroes_after.length; i++) {
			var level = heroes_after[i];
			var temp = hero_info[i].get_cost_to_next_skill(level);
			var next_skill_level = temp[0];
			var c = temp[1];
			while (level < 800) {
				heroes_after[i] = next_skill_level;
				this.add_skill(i, this.hero_skills[i]);
				this.hero_skills[i] += 1;
				level = next_skill_level;
				temp = hero_info[i].get_cost_to_next_skill(level);
				next_skill_level = temp[0];
				c = temp[1];
			}	
		}
		this.heroes = heroes_after;
	};

	this.total_relics = function() {
		var stage_relics = Math.pow(Math.floor(this.current_stage/15) - 5, 1.7);
		var hero_relics = Math.floor(sumArray(this.heroes) / 1000);
		var multiplier = 2 + 0.1 * this.l_ua;
		return Math.floor((stage_relics + hero_relics) * multiplier);
	};

	this.get_total_bonus = function(stype) {
		return this.skill_bonuses[stype];
	};

	this.gold_multiplier = function() {
		var mobs = 10 - this.l_world;

		var h_cg = this.get_total_bonus(STYPE_CHEST_GOLD);
		var h_gd = this.get_total_bonus(STYPE_GOLD_DROPPED);

		var c_gold = 10 * (1 + 0.2 * this.l_chest) * (1 + this.c_cg) * (1 + h_cg);

		var m_gold = mobs * (this.c_chance * c_gold + this.m_multiplier);
		var multiplier_gold = (m_gold + this.boss_gold) / (mobs + 1);
		var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd) * this.other_total;

		return multiplier_gold * multiplier_total;
	};

	this.mob_multiplier = function() {
		var h_cg = this.get_total_bonus(STYPE_CHEST_GOLD);
		var h_gd = this.get_total_bonus(STYPE_GOLD_DROPPED);

		var c_gold = 10 * (1 + 0.2 * this.l_chest) * (1 + this.c_cg) * (1 + h_cg);
		var multiplier_mob = this.c_chance * c_gold + this.m_multiplier;
		var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd) * this.other_total;
		return multiplier_mob * multiplier_total;
	};

	// TODO: take into account particular boss multiplier for stage
	this.gold_for_stage = function(stage) {
		var mobs = 10 - this.l_world + 1;
		var base = base_stage_gold(stage);
		var mult = this.gold_multiplier();
		return mobs * base * mult;
	};

	// TODO: take into account particular boss multiplier for stage
	this.gold_between_stages = function(start_stage, end_stage) {
		var total = 0;
		for (var i = start_stage; i < end_stage; i++) {
			total += base_stage_gold(i);
		}
		var mobs = 10 - this.l_world + 1;
		var mult = this.gold_multiplier();
		return mobs * mult * total;
	};

	this.get_crit_multiplier = function() {
		var h_cd = this.get_total_bonus(STYPE_CRIT_DAMAGE);
		return (10 + h_cd) * (1 + 0.2 * this.l_hthrust) * (1 + this.c_cd);
	};

	this.get_crit_chance = function() {
		var h_cc = this.get_total_bonus(STYPE_CRIT_CHANCE);
		return 0.02 + 0.02 * this.l_dseeker + this.c_cc + h_cc;
	};

	this.get_hero_dps = function() {
		var dps = 0;
		var h_ad = this.get_total_bonus(STYPE_ALL_DAMAGE);
		for (var i in this.heroes) {
			var level = this.heroes[i];
			if (level == 0) {
				continue;
			}

			var hero_dps = hero_info[i].get_base_damage(level);

			var m_hero = 1 + hero_info[i].get_bonuses(level, STYPE_HERO_DPS) + h_ad;
			var m_artifact = 1 + this.a_ad;
			var m_weapon = this.w_bh[i];
			var m_customization = 1 + this.c_ad;
			var m_set = this.w_sb;

			hero_dps = hero_dps * m_hero * m_artifact * m_weapon * m_customization * m_set;
			dps += hero_dps;
		}
		return dps;
	};

	this.tap_damage = function() {
		var h_ad = this.get_total_bonus(STYPE_ALL_DAMAGE);
		var h_td = this.get_total_bonus(STYPE_TAP_DAMAGE);
		var h_pd = this.get_total_bonus(STYPE_PERCENT_DPS);
		var h_cd = this.get_total_bonus(STYPE_CRIT_DAMAGE);
		var h_cc = this.get_total_bonus(STYPE_CRIT_CHANCE);

		var hero_total_dps = this.get_hero_dps();
		
		// from_main = MAIN_LEVEL * pow(1.05, MAIN_LEVEL) * (1 + h_ad)
		var from_main = this.main_dmg * (1 + h_ad);
		var from_hero = (h_pd * hero_total_dps) * (1 + h_td + this.c_td) * (1 + this.a_ad) * (1 + 0.02 * this.l_hammer) * (1 + this.c_ad);
		var total_tap = from_main + from_hero;

		var crit_multiplier = this.get_crit_multiplier();
		var crit_chance = this.get_crit_chance();

		var overall_crit_multiplier = ((1 - crit_chance) + (crit_chance * 0.65 * crit_multiplier));
		var total_tapping = total_tap * overall_crit_multiplier;
		return [total_tap, total_tapping]
	};

	this.level_heroes = function() {
		// buy all the heroes that you can buy
		var heroes_after = this.heroes.slice();
		for (var i in heroes_after) {
			var level = heroes_after[i];
			if (level == 0 && hero_info[i].base_cost < this.current_gold) {
				heroes_after[i] += 1;
				this.current_gold -= hero_info[i].base_cost;
			}
		}

		// level your last hero as much as possible
		var owned = heroes_after.filter(function(h) { return h != 0; });
		var last_owned = owned.length - 1;
		var level_last = heroes_after[last_owned];

		// TODO: javascript is stupid
		for (var i in [100, 10, 1]) {
			var k = Math.pow(10, (2 - i));
			var cost = hero_info[last_owned].cost_to_level(level_last, level_last + k);
			while (cost < this.current_gold) {
				heroes_after[last_owned] += k;
				level_last = heroes_after[last_owned];
				this.current_gold -= cost;
				cost = hero_info[last_owned].cost_to_level(level_last, level_last + k);
			}
		}

		// buy all the skills that you can
		for (var i in heroes_after) {
			if (heroes_after[i] == 0) {
				continue;
			}
			var level = heroes_after[i];
			var temp = hero_info[i].get_cost_to_next_skill(level);
			var next_skill_level = temp[0];
			var cost = temp[1];
			cost += hero_info[i].cost_to_buy_skill(next_skill_level);
			while (cost < this.current_gold && level < 800) {
				heroes_after[i] = next_skill_level;
				this.add_skill(i, this.hero_skills[i]);
				this.hero_skills[i] += 1;
				level = next_skill_level;
				this.current_gold -= cost;
				temp = hero_info[i].get_cost_to_next_skill(level);
				next_skill_level = temp[0];
				cost = temp[1];
				cost += hero_info[i].cost_to_buy_skill(next_skill_level);
			}
		}

		this.heroes = heroes_after;
	};

	this.evolve_heroes = function() {
		var heroes_after = this.heroes.slice();
		for (var i in heroes_after) {
			var level = heroes_after[i];
			if (level == 1000 && hero_info[i].evolve_cost < this.current_gold) {
				heroes_after[i] += 1;
				this.current_gold -= hero_info[i].evolve_cost;
			}
		}
		this.heroes = heroes_after;
	};

	// TODO: make list of log so people can see what's going on
	this.relics_per_second = function() {
		var TAPS_PER_SECOND = 10; // TODO: make this user variable
		this.new_run();

		var done = false;
		var grind = "";
		var end_game = false;
		while (!done) {
			var temp = this.tap_damage();
			var tap = temp[0];
			var tapping = temp[1];

			// ohko things if we can
			var ohko_stage = health_to_stage(tap);
			if (ohko_stage > this.current_stage) {
				this.current_gold += this.gold_between_stages(this.current_stage, ohko_stage + 1);
				this.level_heroes();
				this.time += 4.5 * (ohko_stage - this.current_stage);
				this.current_stage = ohko_stage + 1;
				continue;
			}

			// cannot ohko anymore, start tapping
			var ohko_tapping_stage = health_to_stage(tapping);
			if (ohko_tapping_stage > this.current_stage) {
				this.current_gold += this.gold_between_stages(this.current_stage, ohko_tapping_stage + 1);
				this.level_heroes();
				// TODO: check this, tapping ohko slightly slower than sc ohko?
				this.time += 4.75 * (ohko_tapping_stage - this.current_stage);
				this.current_stage = ohko_tapping_stage + 1;
				continue;
			}


			// cannot ohko anymore, 5 seconds of tapping per boss
			var five_seconds = tapping * TAPS_PER_SECOND * 5;
			var next_boss = next_boss_stage(this.current_stage);
			if (five_seconds > stage_hp(next_boss) * 10) {
				this.current_gold += this.gold_between_stages(this.current_stage, next_boss + 1);
				this.level_heroes();
				var dps = tapping * TAPS_PER_SECOND;
				this.time += (next_boss - this.current_stage) * (4.5 + stage_hp(next_boss) * 12 / dps);
				this.current_stage = next_boss + 1;
				continue;
			}

			if (end_game) {
				var oneohfive_seconds = tapping * TAPS_PER_SECOND * 105;
				var next_boss = next_boss_stage(this.current_stage);
				if (oneohfive_seconds > stage_hp(next_boss) * 10) {
					this.current_gold += this.gold_between_stages(this.current_stage, next_boss + 1);
					this.level_heroes();
					var dps = tapping * TAPS_PER_SECOND;
					// TODO: 12 is random approximation, do better
					this.time += (next_boss - this.current_stage) * (4.5 + stage_hp(next_boss) * 12 / dps);
					this.current_stage = next_boss + 1;
					continue;
				} else {
					done = true;
					continue;
				}
			}

			// cannot kill boss in 5 seconds, see if we want to grind
			var owned_heroes = this.heroes.filter(function(h) { return h != 0; });
			var next_hero = owned_heroes.length;
			var grind_target = 0;
			if (next_hero == 33 && this.heroes[32] < 1001) {
				grind_target = hero_info[32].cost_to_evolve();
				grind = "evolve";
			} else if (next_hero == 33) {
				end_game = true;
				continue;
			} else {
				grind_target = hero_info[next_hero].base_cost;
				grind = "hero";
			}

			var gold_needed = grind_target - this.current_gold;
			// check if we can already get whatever we were grinding for
			if (gold_needed < 0) {
				if (grind == "evolve") {
					this.evolve_heroes();
				}
				if (grind == "hero") {
					this.level_heroes();
				}
				continue;
			}

			// otherwise, how long do we want to grind for
			// TODO: make grind a user variable
			var mob_gold = this.mob_multiplier() * base_stage_gold(this.current_stage);
			if (gold_needed < 200 * mob_gold) {
				var num_mobs = grind_target / mob_gold;
				var mob_hp = stage_hp(this.current_stage);
				this.current_gold += num_mobs * mob_gold;
				this.time += (mob_hp / (tapping * TAPS_PER_SECOND) + 4.5/6.0) * num_mobs;
			} else {
				end_game = true;
			}
		} // end while
		return [this.current_stage, this.time, this.total_relics() / this.time];
	};
}

var METHOD_GOLD = 0;
var METHOD_ALL_DAMAGE = 1;
var METHOD_TAP_DAMAGE = 2;
var METHOD_K = 3;
var METHOD_RELICS_PS = 4;
var METHOD_STAGE_PS = 5;

var get_value = function(game_state, method) {
	switch (method) {
		case METHOD_GOLD:
			return game_state.gold_multiplier();
		case METHOD_ALL_DAMAGE:
			return game_state.a_ad;
		case METHOD_TAP_DAMAGE:
			return game_state.tap_damage()[1];
		case METHOD_K:
			return [game_state.gold_multiplier(), game_state.a_ad * 100];
		case METHOD_RELICS_PS:
			return game_state.relics_per_second()[2];
		case METHOD_STAGE_PS:
			return game_state.relics_per_second().slice(0, 2);
	}
};

var index_max = function(array, custom) {
	var max = array[0];
	var maxIndex = 0;
	for (var i = 1; i < array.length; i++) {
		if ((typeof custom !== "undefined" && custom(array[i], max)) || 
			(typeof custom === "undefined" && array[i] > max)) {
			maxIndex = i;
			max = array[i];
		}
	}
	return maxIndex;
};


var get_best = function(artifacts, weapons, customizations, relics, nsteps, method, greedy) {
	if (greedy) {
		var relics_left = relics;
		var current_artifacts = artifacts.slice();
		var steps = [];
		var cumulative = 0;
		while (relics_left > 0 || steps.length < nsteps) {
			var g = new GameState(current_artifacts, weapons, customizations);
			if ([METHOD_RELICS_PS, METHOD_STAGE_PS].indexOf(method) == -1) {
				// TODO: make this user variable
				g.get_all_skills();
			}
			var base = get_value(g, method);
			var efficiency = newZeroes(artifact_info.length);
			var costs = newZeroes(artifact_info.length);
			for (var i in current_artifacts) {
				var level = current_artifacts[i];
				var relic_cost = artifact_info[i].costToLevel(level);
				costs[i] = relic_cost;
				if (level == 0 || level == artifact_info[i].levelcap || !isFinite(relic_cost) ) {
					continue;
				}
				var artifacts_copy = current_artifacts.slice();
				artifacts_copy[i] += 1;
				var new_g = new GameState(artifacts_copy, weapons, customizations);
				if ([METHOD_RELICS_PS, METHOD_STAGE_PS].indexOf(method) == -1) {
					// TODO: make this user variable
					new_g.get_all_skills();
				}
				var new_value = get_value(new_g, method);
				var e;
				if (method == METHOD_STAGE_PS) {
					e = [(new_value[0] - base[0]) / relic_cost, (base[1] - new_value[1]) / relic_cost];
				} else if (method == METHOD_K) {
					e = (new_value[0] * new_value[1] / (base[0] * base[1]) - 1) / relic_cost;
				} else {
					e = (new_value - base) / relic_cost;
				}
				efficiency[i] = e;
			}
			var best_index;
			if (method != METHOD_STAGE_PS) {
				best_index = index_max(efficiency);
			} else {
				best_index = index_max(efficiency, function(st1, st2) {
					if (st1[0] > st2[0]) {
						return true;
					} else if (st1[0] < st2[0]) {
						return false;
					}
					return st1[1] > st2[1];
				});
			}
			relics_left -= costs[best_index];
			current_artifacts[best_index] += 1;
			cumulative += costs[best_index];
			var step = {};
			step["index"] = best_index;
			step["name"] = artifact_info[best_index].name;
			step["level"] = current_artifacts[best_index];
			step["cost"] = costs[best_index];
			step["cumulative"] = cumulative;
			steps.push(step);
		}
		return steps;
	} else {
		// do some dynamic programming
	}
};

var get_hero_levels = function(heroes, gold) {
	var gold_left = gold;
	var cost100 = gold / 1000;
	var heroes_new = heroes.slice();
	for (var i in heroes_new) {
		var level = heroes_new[i];
		var cost = hero_info[i].cost_to_level(level, level + 100);
		while (cost < cost100) {
			level += 100;
			gold_left -= cost;
			cost = hero_info[i].cost_to_level(level, level + 100);
		}
		heroes_new[i] = level;
	}

	var cost10 = gold_left / 1000;
	for (var i in heroes_new) {
		var level = heroes_new[i];
		var cost = hero_info[i].cost_to_level(level, level + 10);
		while (cost < cost10) {
			level += 10;
			gold_left -= cost;
			cost = hero_info[i].cost_to_level(level, level + 10);
		}
		heroes_new[i] = level;
	}

	var last1000 = Math.floor(sumArray(heroes_new)/1000);
	var last_heroes = heroes_new.slice();
	var costs = new Heap(function(a, b) {
		return a[0] - b[0];
	});
	for (var i in heroes_new) {
		var level = heroes_new[i];
		var cost = hero_info[i].get_upgrade_cost(level);
		costs.push([cost, i]);
	}

	while (gold_left > 0) {
		var temp = costs.pop();
		var cost = temp[0];
		var index = temp[1];
		if (gold_left > cost) {
			gold_left -= cost;
			heroes_new[index] += 1;
			if (Math.floor(sumArray(heroes_new)/1000) > last1000) {
				last1000 = Math.floor(sumArray(heroes_new)/1000);
				last_heroes = heroes_new.slice();
			}
			cost = hero_info[index].get_upgrade_cost(heroes_new[index]);
			costs.push([cost, index]);
		} else {
			break;
		}
	}
	return last_heroes;
};

var get_steps = function(artifacts, weapons, customizations, methods, relics, nsteps, greedy) {
	console.log("omg i'm here");
	console.log("----------------------------------------------------------------");
	console.log(artifacts);
	console.log(weapons);
	console.log(customizations);
	console.log(methods);
	console.log(relics);
	console.log(nsteps);
	console.log(greedy);
	console.log("----------------------------------------------------------------");
	var response = {};
	for (var mi in methods) {
		var m = methods[mi];
		var steps = get_best(artifacts, weapons, customizations, relics, nsteps, m, greedy);
		var summary = {};
		var costs = {};
		for (var s in steps) {
			var step = steps[s];
			var i = step["index"];
			summary[i] = Math.max(step["level"], summary[i] ? summary[i] : 0);
			costs[i] = (costs[i] ? costs[i] : 0) + step["cost"];
		}
		var summary_steps = []
		for (var key in summary) {
			var step = {};
			step["index"] = key;
			step["name"] = artifact_info[key].name;
			step["level"] = summary[key];
			step["cost"] = costs[key];
			summary_steps.push(step);
		}
		var m_response = {};
		m_response["steps"] = steps;
		m_response["summary"] = summary_steps;
		response[m] = m_response;
	}
	return response;
};

var calculate_weapons_probability = function(weapons) {
	// TODO: how does javascript not have a good statistics package
	return 0;
};