var BonusTypes = {
  ALL_DAMAGE_ARTIFACTS:        0,
  ALL_DAMAGE_HEROSKILLS:       1,
  ALL_DAMAGE_CUSTOMIZATIONS:   2,
  ALL_DAMAGE_MEMORY:           3,
  TAP_DAMAGE_ARTIFACTS:        4,
  TAP_DAMAGE_HEROSKILLS:       5,
  TAP_DAMAGE_CUSTOMIZATIONS:   6,
  TAP_DAMAGE_DPS               7,
  CRIT_CHANCE:                 8,
  CRIT_DAMAGE_ARTIFACTS:       9,
  CRIT_DAMAGE_HEROSKILLS:     10,
  CRIT_DAMAGE_CUSTOMIZATIONS: 11,
  GOLD_ARTIFACTS:             12,
  GOLD_HEROSKILLS:            13,
  GOLD_CUSTOMIZATIONS:        14,
  GOLD_OVERALL:               15, // gold while playing
  GOLD_MOBS:                  16,
  GOLD_BOSS:                  17,
  GOLD_10X_CHANCE:            18,
  CHEST_ARTIFACTS:            19,
  CHEST_HEROSKILLS:           20,
  CHEST_CUSTOMIZATIONS:       21,
  CHEST_CHANCE:               22,
  INDIVIDUAL_HERO_DAMAGE:     23,
  BOSS_HEALTH:                24,
  BOSS_TIME:                  25,
  BOSS_DAMAGE:                26,
  NUM_MOBS:                   27,
  RELICS:                     28,
  UPGRADE_COST:               29,
  ARTIFACT_DAMAGE_BOOST:      30,
  SKILL_CDR_AUTO:             31,
  SKILL_CDR_CRIT:             32,
  SKILL_CDR_HERO:             33,
  SKILL_CDR_GOLD:             34,
  SKILL_CDR_TDMG:             35,
  SKILL_CDR_OHKO:             36,
  SKILL_DRN_AUTO:             37,
  SKILL_DRN_CRIT:             38,
  SKILL_DRN_HERO:             39,
  SKILL_DRN_GOLD:             40,
  SKILL_DRN_TDMG:             41,
  SKILL_DRN_OHKO:             42,
  HERO_DEATH_CHANCE:          43,
  HERO_REVIVE_TIME:           44,
  WEAPON_INDIVIDUAL:          45,
  WEAPON_SET:                 46,
};

var Artifact = function(name, world, id, x, y, levelcap, effects, flavor) {
  this.name = name;
  this.world = world;
  this.id = id;
  this.x = x;
  this.y = y;
  this.levelcap = levelcap;
  this.effects = effects;
  this.flavor = flavor;

  this.adpl = effects[BonusTypes.ALL_DAMAGE_ARTIFACTS];

  this.cost = function(level) {
    return x * Math.pow(level, y)
  };

  this.getAD = function(level) {
    return level > 0 ? (adpl * (level + 1)) : 0;
  };

  this.costToLevel = function(level) {
    if (level == 0 || level >= this.levelcap) {
      return Infinity;
    } else {
      return Math.ceil(this.cost(level + 1));
    }
  };
};

var artifactInfo = {
  AOV:       new Artifact("Amulet of the Valrunes",  1,  2, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  25, BonusTypes.GOLD_MOBS:               10}, ""),
  AXE:       new Artifact("Axe of Resolution",       1, 16, 0.5, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_TDMG:          10}, ""),
  BM:        new Artifact("Barbarian's Mettle",      1, 10, 0.4, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_CDR_TDMG:          -5}, ""),
  BREW:      new Artifact("Brew of Absorption",      1, 30, 0.6, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.TAP_DAMAGE_ARTIFACTS:     2}, ""),
  CHEST:     new Artifact("Chest of Contentment",    1, 19, 1.0, 1.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.CHEST_ARTIFACTS:         20}, ""),
  ELIXIR:    new Artifact("Crafter's Elixir",        1, 27, 0.5, 1.8, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.GOLD_OVERALL:            15}, ""), // gold while playing
  EGG:       new Artifact("Crown Egg",               1, 18, 1.0, 1.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.CHEST_CHANCE:            20}, ""),
  CLOAK:     new Artifact("Dark Cloak of Life",      1,  3, 0.5, 2.0,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.BOSS_HEALTH:             -2}, ""),
  DS:        new Artifact("Death Seeker",            1,  4, 0.8, 2.5,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.CRIT_CHANCE:              2}, ""),
  CHALICE:   new Artifact("Divine Chalice",          1, 21, 0.7, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.GOLD_10X_CHANCE:        0.5}, ""),
  HAMMER:    new Artifact("Drunken Hammer",          1, 29, 0.6, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.TAP_DAMAGE_ARTIFACTS:     2}, ""),
  FF:        new Artifact("Future's Fortune",        1, 20, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.GOLD_ARTIFACTS:           5}, ""),
  HT:        new Artifact("Hero's Thrust",           1, 17, 0.7, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   20}, ""),
  HO:        new Artifact("Hunter's Ointment",       1,  8, 0.4, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  60, BonusTypes.SKILL_CDR_HERO:          -5}, ""),
  KS:        new Artifact("Knight's Shield",         1,  1, 0.7, 1.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.GOLD_BOSS:              100}, ""),
  LP:        new Artifact("Laborer's Pendant",       1,  9, 0.7, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_CDR_GOLD:          -5}, ""),
  GAUNTLET:  new Artifact("Ogre's Gauntlet",         1, 12, 0.5, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_AUTO:          10}, ""),
  OA:        new Artifact("Otherworldly Armor",      1, 28, 1.0, 2.2,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.HERO_DEATH_CHANCE:       -5}, ""),
  LOTION:    new Artifact("Overseer's Lotion",       1,  6, 0.4, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_CDR_AUTO:          -5}, ""),
  PARCHMENT: new Artifact("Parchment of Importance", 1, 13, 0.5, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_CRIT:          10}, ""),
  ROO:       new Artifact("Ring of Opulence",        1, 15, 0.7, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_GOLD:          10}, ""),
  ROWC:      new Artifact("Ring of Wondrous Charm",  1, 24, 0.5, 1.7,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.UPGRADE_COST:            -2}, ""),
  SCROLL:    new Artifact("Sacred Scroll",           1,  7, 0.4, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_CDR_CRIT:          -5}, ""),
  SAINTLY:   new Artifact("Saintly Shield",          1, 11, 0.3, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_CDR_OHKO:          -5}, ""),
  SAVIOR:    new Artifact("Savior Shield",           1,  5, 0.5, 1.7,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.BOSS_TIME:               10}, ""),
  TINCTURE:  new Artifact("Tincture of the Maker",   1, 26, 0.6, 2.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:   5, BonusTypes.ARTIFACT_DAMAGE_BOOST:    5}, ""),
  UA:        new Artifact("Undead Aura",             1, 22, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.RELICS:                   5}, ""),
  FISSURE:   new Artifact("Universal Fissure",       1, 14, 0.5, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  60, BonusTypes.SKILL_DRN_HERO:          10}, ""),
  WR:        new Artifact("Warrior's Revival",       1, 23, 1.0, 2.2,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.HERO_REVIVE_TIME:        -5}, ""),
  WI:        new Artifact("Worldly Illuminator",     1, 25, 0.6, 3.0,    5, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 150, BonusTypes.NUM_MOBS:              -100}, ""),

  AOS:       new Artifact("Amulet of Storms",        2, 55, 2.0, 6.0,    5, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 300, BonusTypes.NUM_MOBS:              -100}, ""),
  ORB:       new Artifact("Annihilation Orb",        2, 49, 1.0, 1.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.CHEST_ARTIFACTS:         10, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  AO:        new Artifact("Anointment Ointment",     2, 54, 0.5, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 150, BonusTypes.UPGRADE_COST:            -1, BonusTypes.GOLD_OVERALL:            5}, ""),
  BATON:     new Artifact("Aphrodite's Baton",       2, 53, 1.0, 4.0,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.HERO_REVIVE_TIME:        -2, BonusTypes.GOLD_OVERALL:            5}, ""),
  WAND:      new Artifact("Atomic Wand",             2, 52, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.RELICS:                   2, BonusTypes.GOLD_OVERALL:            5}, ""),
  ADS:       new Artifact("Azure Dragon Statuette",  2, 57, 0.5, 1.8, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.GOLD_OVERALL:             5, BonusTypes.SKILL_DRN_TDMG:          5}, ""),
  BOOTS:     new Artifact("Boots of Wilting",        2, 41, 0.3, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 200, BonusTypes.SKILL_CDR_OHKO:          -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   5}, ""),
  BOB:       new Artifact("Braid of Binding",        2, 48, 1.1, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.CHEST_CHANCE:             5, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  CC:        new Artifact("Chilling Chalice",        2, 40, 0.4, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 200, BonusTypes.SKILL_CDR_TDMG:          -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   5}, ""),
  CM:        new Artifact("Circe's Mirror",          2, 67, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.RELICS:                   2, BonusTypes.GOLD_BOSS:              30}, ""),
  CRYSTAL:   new Artifact("Conjuror Crystal",        2, 58, 1.1, 4.0,   12, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 115, BonusTypes.HERO_DEATH_CHANCE:       -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:  10}, ""),
  CANDLE:    new Artifact("Cosmic Candle",           2, 66, 0.6, 2.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:   5, BonusTypes.ARTIFACT_DAMAGE_BOOST:    2, BonusTypes.GOLD_BOSS:              30}, ""),
  CROWN:     new Artifact("Crown of Cleopatra",      2, 32, 0.9, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  25, BonusTypes.GOLD_MOBS:                5, BonusTypes.SKILL_DRN_CRIT:          5}, ""),
  HORNS:     new Artifact("Demon Horns",             2, 38, 0.4, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 200, BonusTypes.SKILL_CDR_HERO:          -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   5}, ""),
  EOV:       new Artifact("Elixir of Verve",         2, 44, 0.5, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_HERO:           5, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  HARP:      new Artifact("Harp of Medea",           2, 69, 0.5, 3.1,   50, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 140, BonusTypes.BOSS_HEALTH:           -0.5, BonusTypes.GOLD_MOBS:               5}, ""),
  HOF:       new Artifact("Horseshoe of Fortune",    2, 61, 0.6, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.TAP_DAMAGE_ARTIFACTS:     1, BonusTypes.CRIT_DAMAGE_ARTIFACTS:  10}, ""),
  STAFF:     new Artifact("Inebriated Staff",        2, 70, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.GOLD_10X_CHANCE:        0.2, BonusTypes.RELICS:                  2}, ""),
  MANGLE:    new Artifact("Mage's Mantle",           2, 31, 0.7, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.GOLD_BOSS:               40, BonusTypes.SKILL_DRN_AUTO:          5}, ""),
  MM:        new Artifact("Magic Mist",              2, 43, 0.5, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_CRIT:           5, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  MARK:      new Artifact("Mark of Dominance",       2, 56, 0.6, 2.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:   5, BonusTypes.ARTIFACT_DAMAGE_BOOST:    2, BonusTypes.SKILL_DRN_GOLD:          5}, ""),
  EARRING:   new Artifact("Mercury's Earring",       2, 47, 0.7, 2.3, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.CRIT_DAMAGE_ARTIFACTS:    5, BonusTypes.SKILL_DRN_HERO:          5}, ""),
  GLOBE:     new Artifact("Merlin's Globe",          2, 36, 0.4, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 200, BonusTypes.SKILL_CDR_AUTO:          -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   5}, ""),
  MOR:       new Artifact("Mirror of Refraction",    2, 60, 0.6, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.TAP_DAMAGE_ARTIFACTS:     1, BonusTypes.GOLD_10X_CHANCE:         1}, ""),
  GOBLET:    new Artifact("Morgana's Goblet",        2, 68, 0.6, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.GOLD_ARTIFACTS:           2, BonusTypes.GOLD_BOSS:              30}, ""),
  NECKLACE:  new Artifact("Necklace of Nether",      2, 39, 0.7, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 200, BonusTypes.SKILL_CDR_GOLD:          -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   5}, ""),
  PMB:       new Artifact("Pandora's Music Box",     2, 37, 0.4, 2.8,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 200, BonusTypes.SKILL_CDR_CRIT:          -2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   5}, ""),
  PETALS:    new Artifact("Petals of Protection",    2, 59, 0.6, 4.0,   12, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 130, BonusTypes.TAP_DAMAGE_ARTIFACTS:     1, BonusTypes.HERO_DEATH_CHANCE:      -2}, ""),
  PR:        new Artifact("Phoenix Renewed",         2, 42, 0.5, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_AUTO:           5, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  RR:        new Artifact("Ra's Ring",               2, 51, 0.7, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.GOLD_10X_CHANCE:       0.25, BonusTypes.GOLD_OVERALL:            5}, ""),
  ROF:       new Artifact("Ring of Fire",            2, 50, 0.7, 2.3, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.GOLD_ARTIFACTS:           2, BonusTypes.CRIT_DAMAGE_ARTIFACTS:   2}, ""),
  ROD:       new Artifact("Rod of Great Gales",      2, 62, 0.9, 4.0,   12, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 130, BonusTypes.HERO_DEATH_CHANCE:       -2, BonusTypes.HERO_REVIVE_TIME:      -10}, ""),
  ROPE:      new Artifact("Rope of Lashes",          2, 63, 0.5, 3.3,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS: 125, BonusTypes.GOLD_MOBS:                5, BonusTypes.BOSS_TIME:               5}, ""),
  SCARAB:    new Artifact("Scarab of Insanity",      2, 64, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.RELICS:                   2, BonusTypes.GOLD_MOBS:               5}, ""),
  SOL:       new Artifact("Scroll of Lightning",     2, 34, 0.8, 3.4,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.CRIT_CHANCE:              1, BonusTypes.GOLD_MOBS:               5}, ""),
  SG:        new Artifact("Shock Gauntlets",         2, 33, 0.5, 2.6,   50, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  85, BonusTypes.BOSS_HEALTH:           -0.5, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  SOS:       new Artifact("Slippers of Sleep",       2, 65, 0.6, 2.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:   5, BonusTypes.ARTIFACT_DAMAGE_BOOST:    2, BonusTypes.HERO_REVIVE_TIME:       -2}, ""),
  SS:        new Artifact("Swift Swill",             2, 46, 0.5, 2.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:   5, BonusTypes.GOLD_BOSS:               30, BonusTypes.CHEST_ARTIFACTS:        10}, ""),
  VIAL:      new Artifact("Vial of Frost",           2, 45, 0.7, 2.1, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_GOLD:           5, BonusTypes.GOLD_ARTIFACTS:          2}, ""),
  WOW:       new Artifact("Wand of Wonder",          2, 35, 0.5, 3.4,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.BOSS_TIME:                5, BonusTypes.CRIT_CHANCE:             1}, ""),
};

// generate id to enum
var artifactMapping = {};
for (var key in artifactInfo) {
  artifactMapping[artifactInfo[key].id] = artifactInfo[key];
}

var SKILL_LEVELS = {
  1: [10, 25, 50, 100, 200, 400, 800, 1010, 1025, 1050, 1100, 1200, 1400, 1800],
  2: [10, 30, 60, 100, 200, 400, 800, 1010, 1030, 1060, 1100, 1200, 1400, 1800],
};

var levelToSkills = function(world, level) {
  var eqLevel = (level > 1000 ? level - 1000 : level);
  var slevels = SKILL_LEVELS[world].slice(0, 7);
  for (var l in slevels) {
    if (eqLevel < slevels[l]) {
      return l;
    }
  }
  return 7;
};

var HERO_UPGRADE_SCALING = 1.075;
var PRECOMPUTE_UPGRADE_COST = 6000;
var Hero = function(name, id, baseCost, skills) {
  this.name = name;
  this.id = id;
  this.baseCost = baseCost;
  this.skills = skills;

  // base_cost should be of form {1: x, 2: y}
  this.baseCost10 = mapMap(baseCost, function(c) { return c*10; });
  this.upgradeCosts = mapMap(baseCost, function(c) { return [c]; });

  // precompute a bunch of upgrade costs
  var m = HERO_UPGRADE_SCALING;
  for (var i = 1; i < PRECOMPUTE_UPGRADE_COST; i++) {
    for (var w in baseCost) {
      this.upgradeCosts[w].push((i < 1000 ? this.baseCost[w] : this.baseCost10[w]) * m);
      m *= HERO_UPGRADE_SCALING;
    }
  }

  this.evolveCost = mapMap(this.upgradeCosts, function(l) { return 10.75 * l[999]; });

  this.getUpgradeCost = function(world, level) {
    if (level < PRECOMPUTE_UPGRADE_COST) {
      return this.upgradeCosts[world][level];
    }
    return (level < 1000 ? this.baseCost[world] : this.baseCost10[world]) * Math.pow(HERO_UPGRADE_SCALING, level);
  };

  this.getBonuses = function(world, level, btype) {
    var bonus = 0;
    for (var i = 0; i < levelToSkills(world, level); i++) {
      if (skills[world][i][1] == btype) {
        bonus += skills[world][i][0];
      }
    }
    return bonus;
  };

  this.getAllBonuses = function(world, level) {
    var bonuses = {};
    for (var i = 0; i < levelToSkills(world, level); i++) {
      var skillType = skills[world][i][1];
      // TODO: ternary if (bonuses[skillType] ? bonuses[skillType] : 0) + blah
      if (!(skillType in bonuses)) {
        bonuses[skillType] = 0;
      }
      bonuses[skillType] += skills[world][i][0];
    }
    return bonuses;
  };

  this.getBaseDamage = function(world, level) {
    // HeroInfo.GetDPSByLevel (without all the multipliers)
    var n, m;
    var c = this.getUpgradeCost(world, level - 1);
    if (level >= 1001) {
      n = Math.max(Math.pow(0.904, level - 1001) * Math.pow(0.715, this.id + 33), 1e-308);
      m = Math.pow(1.075, level - 1000) - 1;
    } else {
      n = Math.max(Math.pow(0.904, level - 1) * Math.pow(1 - (0.019 * Math.min(this.id, 15)), this.id), 1e-308);
      m = Math.pow(1.075, level) - 1;
    }
    return (n * c * m) / 0.75;
  };
}

var heroInfo = [
  new Hero("Takeda the Blade Assassin", 1, {1: 50, 2: }, {
    1: [[50, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [100, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[100, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [50000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Contessa the Torch Wielder", 2, {1: 175, 2: }, {
    1: [[5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [100, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[6, BonusTypes.TAP_DAMAGE_HEROSKILLS], [200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [15, BonusTypes.GOLD_HEROSKILLS], [30000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Hornetta, Queen of the Valrunes", 3, {1: 674, 2: }, {
    1: [[150, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS],
        [20, BonusTypes.CHEST_HEROSKILLS], [1, BonusTypes.CRIT_CHANCE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS],
        [20, BonusTypes.CHEST_HEROSKILLS], [1, BonusTypes.CRIT_CHANCE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Mila the Hammer Stomper", 4, {1: 2.85e3, 2: }, {
    1: [[100, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [800, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [6, BonusTypes.GOLD_HEROSKILLS], [500, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS]],
    2: [[150, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [25, BonusTypes.CHEST_HEROSKILLS]]}),
  new Hero("Terra the Land Scorcher", 5, {1: 13.30e3, 2: }, {
    1: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS], [15, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS], [17, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [88000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Inquisireaux the Terrible", 6, {1: 68.10e3, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [700, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS],
        [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[230, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [777, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS],
        [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [65000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Charlotte the Special", 7, {1: 384.00e3, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.BOSS_DAMAGE], [7, BonusTypes.BOSS_DAMAGE], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[550, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.BOSS_DAMAGE], [7, BonusTypes.BOSS_DAMAGE], [1600, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Jordaan, Knight of Mini", 8, {1: 2.38e6, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS], [15, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [1900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[480, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.GOLD_HEROSKILLS],
        [25, BonusTypes.CHEST_HEROSKILLS], [8500, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Jukka, Master of Axes", 9, {1: 23.80e6, 2: }, {
    1: [[150, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.BOSS_DAMAGE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [5000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.BOSS_DAMAGE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [9000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.ALL_DAMAGE_HEROSKILLS], [58000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Milo and Clonk-Clonk", 10, {1: 143.00e6, 2: }, {
    1: [[150, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.CRIT_CHANCE], [5, BonusTypes.BOSS_DAMAGE], [15, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [25, BonusTypes.CHEST_HEROSKILLS], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[220, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.CRIT_CHANCE], [5, BonusTypes.BOSS_DAMAGE], [15, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [9900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Macelord the Ruthless", 11, {1: 943.00e6, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [850, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS],
        [15, BonusTypes.GOLD_HEROSKILLS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [3800, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS],
        [15, BonusTypes.GOLD_HEROSKILLS], [1, BonusTypes.CRIT_CHANCE], [67600, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Gertrude the Goat Rider", 12, {1: 6.84e9, 2: }, {
    1: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [7, BonusTypes.BOSS_DAMAGE], [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [0.4, BonusTypes.TAP_DAMAGE_DPS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.GOLD_HEROSKILLS]],
    2: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [7, BonusTypes.BOSS_DAMAGE], [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [0.4, BonusTypes.TAP_DAMAGE_DPS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Twitterella the Tweeter", 13, {1: 54.70e9, 2: }, {
    1: [[150, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [850, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS],
        [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [12000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[280, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS],
        [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [7, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [55500, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Master Hawk, Lord of Luft", 14, {1: 8200e9, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1100, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS], [400, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.GOLD_HEROSKILLS]],
    2: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1100, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS], [400, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Elpha, Wielder of Gems", 15, {1: 8.20e12, 2: }, {
    1: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [40, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE], [2, BonusTypes.CRIT_CHANCE],
        [15, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[800, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [40, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE], [2, BonusTypes.CRIT_CHANCE],
        [15, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [78000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Poppy, Daughter of Ceremony", 16, {1: 164.00e12, 2: }, {
    1: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.CHEST_HEROSKILLS], [20, BonusTypes.GOLD_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE],
        [7, BonusTypes.BOSS_DAMAGE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.CHEST_HEROSKILLS], [20, BonusTypes.GOLD_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE],
        [7, BonusTypes.BOSS_DAMAGE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Skulptor, Protector of Bridges", 17, {1: 1.64e15, 2: }, {
    1: [[150, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS],
        [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [10, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [25, BonusTypes.GOLD_HEROSKILLS]],
    2: [[270, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS],
        [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [10, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [25, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Sterling the Enchantor", 18, {1: 49.20e15, 2: }, {
    1: [[400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [500, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.BOSS_DAMAGE], [450, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.BOSS_DAMAGE], [3500, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Orba the Foreseer", 19, {1: 2.46e18, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.5, BonusTypes.TAP_DAMAGE_DPS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.5, BonusTypes.TAP_DAMAGE_DPS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Remus the Noble Archer", 20, {1: 73.80e18, 2: }, {
    1: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [450, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [0.4, BonusTypes.TAP_DAMAGE_DPS], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS]],
    2: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2800, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [0.4, BonusTypes.TAP_DAMAGE_DPS], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [10, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Mikey the Magician Apprentice", 21, {1: 2.44e21, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS], [73000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Peter Pricker the Prickly Poker", 22, {1: 244.00e21, 2: }, {
    1: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [750, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [500, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[250, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1050, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [4000, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Teeny Tom, Keeper of the Castle", 23, {1: 48.70e24, 2: }, {
    1: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [800, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [10000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [800, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS],
        [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [75000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Deznis the Cleanser", 24, {1: 1950e27, 2: }, {
    1: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [500, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [15, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [9000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[200, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [8000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [15, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.CHEST_HEROSKILLS], [88000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Hamlette, Painter of Skulls", 25, {1: 21.40e30, 2: }, {
    1: [[5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS],
        [15, BonusTypes.GOLD_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [15000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]],
    2: [[5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [5, BonusTypes.TAP_DAMAGE_HEROSKILLS], [0.4, BonusTypes.TAP_DAMAGE_DPS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS],
        [15, BonusTypes.GOLD_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [15000, BonusTypes.INDIVIDUAL_HERO_DAMAGE]]}),
  new Hero("Eistor the Banisher", 26, {1: 2.36e36, 2: }, {
    1: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [650, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS], [5, BonusTypes.BOSS_DAMAGE],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE], [12, BonusTypes.GOLD_HEROSKILLS]],
    2: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [999, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [0.4, BonusTypes.TAP_DAMAGE_DPS], [5, BonusTypes.BOSS_DAMAGE],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE], [12, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Flavius and Oinksbjorn", 27, {1: 25.90e45, 2: }, {
    1: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [700, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE],
        [2, BonusTypes.CRIT_CHANCE], [30, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS]],
    2: [[300, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1500, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [5, BonusTypes.BOSS_DAMAGE],
        [2, BonusTypes.CRIT_CHANCE], [30, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [20, BonusTypes.CHEST_HEROSKILLS]]}),
  new Hero("Chester the Beast Tamer", 28, {1: 2850e60, 2: }, {
    1: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.ALL_DAMAGE_HEROSKILLS], [400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.ALL_DAMAGE_HEROSKILLS], [1500, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [3200, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Mohacas the Wind Warrior", 29, {1: 3.14e81, 2: }, {
    1: [[330, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [550, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [20, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.GOLD_HEROSKILLS]],
    2: [[330, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [20, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Jaqulin the Unknown", 30, {1: 3.14e96, 2: }, {
    1: [[1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.GOLD_HEROSKILLS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.GOLD_HEROSKILLS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Pixie the Rebel Fairy", 31, {1: 3.76e116, 2: }, {
    1: [[900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.CRIT_CHANCE], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [25, BonusTypes.CHEST_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [15, BonusTypes.GOLD_HEROSKILLS]],
    2: [[900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [5000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.CRIT_CHANCE], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [25, BonusTypes.CHEST_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [15, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Jackalope the Fireballer", 32, {1: 4.14e136, 2: }, {
    1: [[40, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.GOLD_HEROSKILLS], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [2, BonusTypes.CRIT_CHANCE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.BOSS_DAMAGE]],
    2: [[990, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.GOLD_HEROSKILLS], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [2, BonusTypes.CRIT_CHANCE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.BOSS_DAMAGE]]}),
  new Hero("Dark Lord, Punisher of All", 33, {1: 456e156, 2: }, {
    1: [[2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.TAP_DAMAGE_HEROSKILLS], [1, BonusTypes.TAP_DAMAGE_DPS], [25, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [40, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[2500, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.TAP_DAMAGE_HEROSKILLS], [1, BonusTypes.TAP_DAMAGE_DPS], [25, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [40, BonusTypes.ALL_DAMAGE_HEROSKILLS]]})];

// TODO: check if we need this index
var cMapping = {
  "0": 2, // gold dropped - hats
  "1": 1, // crit damage - scarves
  "2": 4, // crit chance - shirts
  "3": 0, // all damage - swords
  "4": 5, // tap damage - trails
  "5": 3  // chest gold - auras
};

var cBonus = [
  BonusTypes.ALL_DAMAGE_CUSTOMIZATIONS,
  BonusTypes.CRIT_DAMAGE_CUSTOMIZATIONS,
  BonusTypes.GOLD_CUSTOMIZATIONS,
  BonusTypes.CHEST_CUSTOMIZATIONS,
  BonusTypes.CRIT_CHANCE,
  BonusTypes.TAP_DAMAGE_CUSTOMIZATIONS
];

var CTYPE_D = 0;
var CTYPE_P = 1;
var CTYPE_T = 2;
var CTYPE_S = 3;
var CTYPE_N = 4;

var Customization = function(name, value, cost, ctype, label) {
  this.name = name;
  this.value = value;
  this.cost = cost;
  this.ctype = ctype;
  this.label = label;
  this.type = cMapping[label[0]]; // acts as index
  this.bonus = cBonus[this.type];
}

var customizationInfo = [
  // All Damage - Swords
  new Customization("Hero Sword",          0,    0, CTYPE_N, "3_0"),
  new Customization("Knight Sword",        2,    1, CTYPE_P, "3_901"),
  new Customization("Charlemagne",         2,    3, CTYPE_P, "3_902"),
  new Customization("Ice Sword",           3,    7, CTYPE_P, "3_903"),
  new Customization("Fire Sword",          3,   15, CTYPE_P, "3_904"),
  new Customization("Mad Max",             4,   25, CTYPE_P, "3_905"),
  new Customization("Purple Dragon",       4,   30, CTYPE_P, "3_906"),
  new Customization("Warrior Blade",       5,   40, CTYPE_P, "3_907"),
  new Customization("Skull Blade",         5,   50, CTYPE_P, "3_19"),
  new Customization("Goofy Hammer",        6,   70, CTYPE_P, "3_3"),
  new Customization("Carrot",              6,  100, CTYPE_P, "3_4"),
  new Customization("Kunai",               7,  200, CTYPE_P, "3_29"),
  new Customization("Colossus",            7,  300, CTYPE_P, "3_909"),
  new Customization("Balloon",             7,  400, CTYPE_P, "3_22"),
  new Customization("Spiky Sword",         7,  500, CTYPE_P, "3_12"),
  new Customization("Laser Dagger",        6,  620, CTYPE_D, "3_30"),
  new Customization("Broom",               3,  270, CTYPE_D, "3_26"),
  new Customization("Curved Blade",        1,  110, CTYPE_D, "3_1"),
  new Customization("Umbrella",            9,  880, CTYPE_D, "3_13"),
  new Customization("Fencing Sword",       5,  500, CTYPE_D, "3_5"),
  new Customization("Meat Hook",           1,   80, CTYPE_D, "3_15"),
  new Customization("Popsicle",            2,  100, CTYPE_D, "3_10"),
  new Customization("Golf Stick",          2,  150, CTYPE_D, "3_25"),
  new Customization("Sai",                 2,  200, CTYPE_D, "3_20"),
  new Customization("Guitar",              3,  350, CTYPE_D, "3_21"),
  new Customization("Wooden Sword",        5,  500, CTYPE_D, "3_14"),
  new Customization("Scythe",              6,  666, CTYPE_D, "3_11"),
  new Customization("Hola Sword",          8,  860, CTYPE_D, "3_7"),
  new Customization("Poop",                9, 1000, CTYPE_D, "3_18"),
  new Customization("Wisdom Sword",       12, 1500, CTYPE_D, "3_17"),
  new Customization("Pixel Sword",        12, 1500, CTYPE_D, "3_28"),
  // Crit Damage - Scarves
  new Customization("Red",                 0,    0, CTYPE_N, "1_0"),
  new Customization("Shimmering",          3,    2, CTYPE_P, "1_9"),
  new Customization("Blue",                5,    5, CTYPE_P, "1_1"),
  new Customization("Blue Wrap",           7,   10, CTYPE_P, "1_3"),
  new Customization("Green",              10,   20, CTYPE_P, "1_2"),
  new Customization("Metallic",           10,   50, CTYPE_P, "1_11"),
  new Customization("Red Wrap",            1,   30, CTYPE_D, "1_8"),
  new Customization("Green Wrap",          4,   85, CTYPE_D, "1_4"),
  new Customization("Yellow",              4,   75, CTYPE_D, "1_5"),
  new Customization("Yellow Wrap",        19,  380, CTYPE_D, "1_6"),
  new Customization("Purple",             22,  435, CTYPE_D, "1_7"),
  new Customization("Brown",               6,  110, CTYPE_D, "1_10"),
  // Gold Dropped - Hats
  new Customization("None",                0,    0, CTYPE_N, "0_0"),
  new Customization("Top Hat",             5,   50, CTYPE_S, "0_14"),
  new Customization("Blue Knight",         5,  300, CTYPE_S, "0_2"),
  new Customization("Cat Hood",            5,  400, CTYPE_S, "0_3"),
  new Customization("Ninja Mask",          5,  700, CTYPE_S, "0_6"),
  new Customization("Astronaut Helmet",    5, 1000, CTYPE_S, "0_1"),
  new Customization("Cowboy Hat",          5, 1500, CTYPE_S, "0_4"),
  new Customization("Ice Cream Cone" ,     5, 1600, CTYPE_S, "0_5"),
  new Customization("Witch Hat",          10,  500, CTYPE_D, "0_8"),
  new Customization("Pixel Helmet",       10,  550, CTYPE_D, "0_7"),
  new Customization("Robot Helmet",       13,  650, CTYPE_D, "0_9"),
  new Customization("Snowman Head",        6,  310, CTYPE_D, "0_10"),
  new Customization("Water Melon",         7,  770, CTYPE_D, "0_13"),
  new Customization("Bat",                 5,  250, CTYPE_D, "0_11"),
  // Chest Gold - Auras
  new Customization("None",                0,    0, CTYPE_N, "5_0"),
  new Customization("Stars",               5,  100, CTYPE_S, "5_1"),
  new Customization("Thunderbolt",         7,  200, CTYPE_S, "5_2"),
  new Customization("Electric",           10,  500, CTYPE_S, "5_3"),
  new Customization("Eminence Light",     10,  600, CTYPE_S, "5_5"),
  new Customization("Flame",              10, 1300, CTYPE_S, "5_4"),
  new Customization("Spiky",              10, 2000, CTYPE_S, "5_8"),
  new Customization("Leaf Shield",        50,  990, CTYPE_D, "5_6"),
  new Customization("Resurrection Light", 15,  340, CTYPE_D, "5_7"),
  new Customization("Skulls",             40,  620, CTYPE_D, "5_9"),
  new Customization("Bubbles",            20,  380, CTYPE_D, "5_10"),
  // Crit Chance - Armor
  new Customization("Hero Suit",           0,    0, CTYPE_N, "2_0"),
  new Customization("Casual",            0.5,   10, CTYPE_T, "2_3"),
  new Customization("Astronaut",         0.5,  150, CTYPE_T, "2_1"),
  new Customization("Blue Knight",       0.5,  200, CTYPE_T, "2_2"),
  new Customization("Cat Suit",          0.5,  500, CTYPE_T, "2_4"),
  new Customization("Ninja",             0.5,  700, CTYPE_T, "2_6"),
  new Customization("Purple Wizard",     0.5, 1000, CTYPE_T, "2_14"),
  new Customization("Saiyan",            0.5, 1300, CTYPE_T, "2_10"),
  new Customization("Pyjamas",             1,  400, CTYPE_D, "2_13"),
  new Customization("Renaissance",       0.5,   50, CTYPE_D, "2_8"),
  new Customization("Robot",               1,  450, CTYPE_D, "2_9"),
  new Customization("Snowman",             3, 1000, CTYPE_D, "2_11"),
  new Customization("Storm Armor",       0.5,  250, CTYPE_D, "2_12"),
  new Customization("Green Knight",        1,  430, CTYPE_D, "2_17"),
  new Customization("White and Gold",      1,  310, CTYPE_D, "2_16"),
  new Customization("Grey Knight",         2,  800, CTYPE_D, "2_5"),
  new Customization("Casual2",             1,  350, CTYPE_D, "2_15"),
  // Tap Damage - Trails
  new Customization("White",               0,    0, CTYPE_N, "4_0"),
  new Customization("Cool Blue",           4,   50, CTYPE_T, "4_1"),
  new Customization("Rainbow",             4,  100, CTYPE_T, "4_2"),
  new Customization("Dirt",                4,  300, CTYPE_T, "4_3"),
  new Customization("Flame",               4,  400, CTYPE_T, "4_4"),
  new Customization("Ice",                 4,  410, CTYPE_D, "4_5"),
  new Customization("Lightning Blue",      6,  700, CTYPE_D, "4_6"),
  new Customization("Fiery Red",           2,  140, CTYPE_D, "4_7"),
  new Customization("Passion",             8,  620, CTYPE_D, "4_8"),
  new Customization("Shadow",              2,  290, CTYPE_D, "4_9"),
  new Customization("Water",               6,  490, CTYPE_D, "4_10")
];

var customizationMapping = {};
for (var k in customizationInfo) {
  customizationMapping[customizationInfo[k].label] = customizationInfo[k];
}

var customizationMax = cBonus.map(function(a) { return 0; });
customizationInfo.forEach(function(c, i) {
  customizationMax[c.type] += c.value;
});

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

// weapons is array of counts, returns individual hero bonuses
var getHeroWeaponBonuses = function(weapons) {
  return weapons.map(function(n) { return 100 + 50 * n; });
};

var numberOfSets = function(weapons) {
  return Math.min.apply(null, weapons);
};

var setBonus = function(weapons) {
  var sets = numberOfSets(weapons);
  return sets == 0 ? 100 : 1000*sets;
};

var MONSTER_HP_LEVEL_OFF = 156;
var MONSTER_HP_MULTIPLIER = 18.5;
var MONSTER_HP_BASE_1 = 1.57;
var MONSTER_HP_BASE_2 = 1.17;

var STAGE_CONSTANT = MONSTER_HP_MULTIPLIER * Math.pow(MONSTER_HP_BASE_1, MONSTER_HP_LEVEL_OFF);

var BOSS_CONSTANT = (2 + 4*MONSTER_HP_BASE_2 + 6*Math.pow(MONSTER_HP_BASE_2, 2) + 7*Math.pow(MONSTER_HP_BASE_2, 3) + 10*Math.pow(MONSTER_HP_BASE_2, 4)) /
                    (1 + MONSTER_HP_BASE_2 + Math.pow(MONSTER_HP_BASE_2, 2) + Math.pow(MONSTER_HP_BASE_2, 3) + Math.pow(MONSTER_HP_BASE_2, 4));

var BOSS_GOLD_CONSTANT = 2 + 4 + 6 + 7 + 10 / 5.0;

// TODO: maybe redundant - main.js
var newZeroes = function(length) {
  return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

var sumArray = function(array) {
  return array.reduce(function(a, b) { return a + b; });
};

var EMPTY_BONUSES = Object.keys(BonusTypes).map(function(b) { return 0; });
EMPTY_BONUSES[BonusTypes.WEAPON_INDIVIDUAL] = heroInfo.map(function(h) { return 0; });
EMPTY_BONUSES[BonusTypes.INDIVIDUAL_HERO_DAMAGE] = heroInfo.map(function(h) { return 0; });

var getEmptyBonuses = function() {
  return EMPTY_BONUSES.slice();
};

var addArtifacts = function(world, bonuses, artifacts) {
  artifacts.forEach(function(a, i) {
    var id = a[0];
    var level = a[1];
    var artifact = artifactMapping[id];

    if (level != 0) {
      for (var bonusType in artifact.effects) {
        bonuses[bonusType] += artifact.effects[bonusType] * level;
        if (bonusType == BonusTypes.ALL_DAMAGE_ARTIFACTS) {
          // because AD is actually (level + 1) * adpl
          bonuses[bonusType] += artifact.effects[bonusType];
        }
      }
    }
  });
};

var addLevels = function(world, bonuses, levels) {
  levels.forEach(function(l, i) {
    var hero = heroInfo[i];
    var bonuses = hero.getAllBonuses(world, l);
    for (var bonusType in bonuses) {
      if (bonusTypes == BonusTypes.INDIVIDUAL_HERO_DAMAGE) {
        bonuses[bonusType][i] += bonuses[bonusType];
      } else {
        bonuses[bonusType] += bonuses[bonusType];
      }
    }
  });
};

var addWeapons = function(world, bonuses, weapons) {
  bonuses[BonusTypes.WEAPON_SET] = setBonus(weapons);
  bonuses[BonusTypes.WEAPON_INDIVIDUAL] = getHeroWeaponBonuses(weapons);
};

var addCustomizations = function(world, bonuses, customizations) {
  customizations.forEach(function(c, i) {
    bonuses[cBonus[i]] += c;
  });
};

var BASE_CRIT_CHANCE = 0.02;
var BASE_CHEST_CHANCE = 0.02;
var MAIN_HERO_DAMAGE = 600 * Math.pow(1.05, 600);
var BASE_SKILL_CRIT_COOLDOWN = 1800;
var BASE_SKILL_TDMG_COOLDOWN = 3600;
var BASE_SKILL_CRIT_DURATION = 30;
var BASE_SKILL_TDMG_DURATION = 30;

// params {
//  world: 1 or 2
//  artifacts: array of [artifact id, level]
//  levels: array of hero level, ordered by id
//  weapons: array of weapon counts, ordered by id
//  customizations: array of totals
//  skillLevelCrit: int
//  skillLevelTDMG: int
//  memory: % int
// }
var GameState = function(params) {
  this.bonuses = getEmptyBonuses();
  this.world = params.world;

  // need for tap damage
  this.levels = params.levels;
  this.skillLevelCrit = params.skillLevelCrit;
  this.skillLevelTDMG = params.skillLevelTDMG;

  addArtifacts(this.world, this.bonuses, params.artifacts);
  addLevels(this.world, this.bonuses, params.levels);
  addWeapons(this.world, this.bonuses, params.weapons);
  addCustomizations(this.world, this.bonuses, params.customizations);
  this.bonuses[BonusTypes.ALL_DAMAGE_MEMORY] = params.memory;

  this.getBonus = function(bonusType) {
    return this.bonuses[bonusType] / 100.0;
  };

  this.getHeroBonus = function(i) {
    return this.bonuses[BonusTypes.INDIVIDUAL_HERO_DAMAGE][i] / 100.0;
  };

  this.getWeaponBonus = function(i) {
    return this.bonuses[BonusTypes.WEAPON_INDIVIDUAL][i] / 100.0;
  };

  this.getSetBonus = function() {
    return this.bonuses[BonusTypes.WEAPON_SET] / 100.0;
  };

  this.getAllDamage = function() {
    return this.bonuses[BonusTypes.ALL_DAMAGE_ARTIFACTS];
  };

  // Returns the average multiplier across all mobs and bosses and stages for
  // how much gold you'll get relative to the base gold of one normal mob
  this.getGoldMultiplier = function() {
    // PlayerModel.RewardEnemyGold
    // StageController.GetStageBaseGold

    var numberOfMobs = 10 + this.getBonus(BonusTypes.NUM_MOBS);

    // StageController.GetTreasureSpawnChance
    var chestChance = Math.min(1, BASE_CHEST_CHANCE * (1 + this.getBonus(BonusTypes.CHEST_CHANCE)));
    var chestGold = 10 * (1 + this.getBonus(BonusTypes.CHEST_ARTIFACTS))
                       * (1 + this.getBonus(BonusTypes.CHEST_HEROSKILLS))
                       * (1 + this.getBonus(BonusTypes.CHEST_CUSTOMIZATIONS));

    var mobChance = 1 - chestChance;
    var mobGold = (1 + this.getBonus(BonusTypes.GOLD_MOBS));

    var chance10x = Math.min(1, this.getBonus(BonusTypes.GOLD_10X_CHANCE));
    var multiplier10x = 1 + 9*chance10x; // chance10x * 10 + (1 - chance10x) * 1

    var mobMultiplier = mobGold * multiplier10x;

    var goldFromMobs = numberOfMobs * (chestChance * chestGold + mobChance * mobMultiplier);
    var goldFromBoss = BOSS_GOLD_CONSTANT * (1 + this.getBonus(BonusTypes.GOLD_BOSS));

    var averageMobBossGold = (goldFromMobs + goldFromBoss) / (numberOfMobs + 1);

    var additiveMultipliers = Math.ceil(1 + this.getBonus(BonusTypes.GOLD_ARTIFACTS)
                                          + this.getBonus(BonusTypes.GOLD_HEROSKILLS)
                                          + this.getBonus(BonusTypes.GOLD_CUSTOMIZATIONS));
    var overallMultiplier = 1 + this.getBonus(BonusTypes.GOLD_OVERALL);
    var upgradeMultiplier = 1 / (1 + this.getBonus(BonusTypes.UPGRADE_COST));

    return averageMobBossGold * additiveMultipliers * overallMultiplier * upgradeMultiplier;
  };

  this.getTotalHeroDPS = function() {
    // HeroInfo.GetDPSByLevel
    var dps = 0;
    this.levels.forEach(function(level, i) {
      if (level == 0) return;

      var heroDPS = heroInfo[i].getBaseDamage(this.world, level);
      var m1 = 1 + this.getHeroBonus(i)
                 + this.getBonus(BonusTypes.ALL_DAMAGE_HEROSKILLS)
                 + this.getBonus(BonusTypes.ALL_DAMAGE_MEMORY);
      var m2 = 1 + this.getBonus(BonusTypes.ALL_DAMAGE_ARTIFACTS);
      var m3 = 1 + this.getBonus(BonusTypes.ALL_DAMAGE_CUSTOMIZATIONS);
      var mw = getWeaponBonus(i);
      var ms = getSetBonus();

      heroDPS = heroDPS * m1 * m2 * m3 * mw * ms;
      dps += heroDPS;
    });
    return dps;
  };

  this.getTapDamage = function() {
    // PlayerInfo.GetAttackDamageByLevel
    var totalHeroDPS = this.getTotalHeroDPS();
    var totalDPS = totalHeroDPS + MAIN_HERO_DPS;

    var m1 = 1 + this.getBonus(BonusTypes.TAP_DAMAGE_HEROSKILLS) + this.getBonus(BonusTypes.TAP_DAMAGE_CUSTOMIZATIONS);
    var m2 = 1 + this.getBonus(BonusTypes.ALL_DAMAGE_ARTIFACTS);
    var m3 = 1 + this.getBonus(BonusTypes.TAP_DAMAGE_ARTIFACTS);
    var m4 = 1 + this.getBonus(BonusTypes.ALL_DAMAGE_CUSTOMIZATIONS);

    // Should match the displayed Tap Damage
    var totalTapDamage = totalDPS * m1 * m2 * m3 * m4;

    var critMultiplier = (10 + this.getBonus(BonusTypes.CRIT_DAMAGE_HEROSKILLS))
                       * (1 + this.getBonus(BonusTypes.CRIT_DAMAGE_ARTIFACTS)
                       * (1 + this.getBonus(BonusTypes.CRIT_DAMAGE_CUSTOMIZATIONS));
    var critChance = Math.min(1, BASE_CRIT_CHANCE + this.getBonus(BonusTypes.CRIT_CHANCE));
    var overallCritMultiplier = ((1 - critChance) + (critChance * 0.65 * critMultiplier));

    // Average damage done per tap
    var totalTappingDamage = totalTapDamage * overallCritMultiplier;

    var skillCritCDR = BASE_SKILL_CRIT_COOLDOWN * (1 + this.getBonus(BonusTypes.SKILL_CDR_CRIT));
    var skillCritDRN = BASE_SKILL_CRIT_DURATION * (1 + this.getBonus(BonusTypes.SKILL_DRN_CRIT));
    var skillCritUptime = Math.max(0, Math.min(1, skillCritCDR / skillCritDRN));
    // Not sure how to deal with poisonous touch yet
    if (this.world == 2) { skillCritUptime = 0; }

    var skillBonusCritChance = this.skillLevelCrit > 0 ? (0.17 + 0.03 * (this.skillLevelCrit - 1)) : 0;
    // Outermost Math.min should be unecessary, but just in case
    var skillAverageCritChance = Math.min(1, critChance * (1 - skillCritUptime) + Math.min(1, critChance + skillBonusCritChance) * skillCritUptime)
    var skillAverageCritMultiplier = ((1 - skillAverageCritChance) + (skillAverageCritChance * 0.65 * critMultiplier));

    var skillTDMGCDR = BASE_SKILL_TDMG_COOLDOWN * (1 + this.getBonus(BonusTypes.SKILL_CDR_TDMG));
    var skillTDMGDRN = BASE_SKILL_TDMG_DURATION * (1 + this.getBonus(BonusTypes.SKILL_DRN_TDMG));
    var skillTDMGUptime = Math.max(0, Math.min(1, skillTDMGCDR / skillTDMGDRN));
    var skillTDMGBonus = this.skillLevelTDMG > 0 ? (0.70 + 0.3 * (this.skillLevelTDMG - 1)) : 0;
    var skillTDMGMultiplier = 1 + (skillTDMGUptime * skillTDMGBonus); // (1 - uptime) * 1 + uptime * (1 + bonus)

    var totalSkillsDamage = totalTapDamage * skillAverageCritMultiplier * skillTDMGMultiplier;

    return [totalTapDamage, totalTappingDamage, totalSkillsDamage];
  };

  this.nextFFLevel = function(ff) {
    var newLevel = ff;
    var multiplier = function(l) {
        return Math.ceil(1 + (l * artifactInfo.FF.effects[BonusTypes.GOLD_ARTIFACTS] / 100)
                           + this.getBonus(BonusTypes.GOLD_HEROSKILLS)
                           + this.getBonus(BonusTypes.GOLD_CUSTOMIZATIONS));
    };
    while (multiplier(newLevel) == multiplier(ff)) {
      newLevel += 1;
    }
    return newLevel;
  };
};

var Methods = {
  ALL_DAMAGE:     0,
  GOLD:           1,
  TAP_DAMAGE:     2,
  DMG_EQUIVALENT: 3,
};

var getValue = function(gameState, method, actives) {
  var a = actives ? 2 : 1;
  switch (method) {
    case Methods.ALL_DAMAGE:     return gameState.getAllDamage();
    case Methods.GOLD:           return gameState.getGoldMultiplier();
    case Methods.TAP_DAMAGE:     return gameState.getTapDamage()[a];
    case Methods.DMG_EQUIVALENT: return { gold: gameState.getGoldMultiplier(), tdmg: gameState.getTapDamage()[a] };
    default: console.log("NO UNDERSTANDO");
  }
};

var getMax = function(array, custom) {
  var max = array[0];
  var maxIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (custom(array[i], max)) {
      maxIndex = i;
      max = array[i];
    }
  }
  return max;
};

var copyParamsForGameState = function(params, newArtifacts) {
  return {
    world:          params.world,
    artifacts:      newArtifacts,
    levels:         params.levels,
    weapons:        params.weapons,
    memory:         params.memory,
    customizations: params.customizations,
    skillLevelCrit: params.skillLevelCrit,
    skillLevelTDMG: params.skillLevelTDMG,
  };
};

// params {
//  world: 1 or 2
//  artifacts: array of [artifact id, level]
//  levels: array of hero level, ordered by id
//  weapons: array of weapon counts, ordered by id
//  customizations: array of totals
//  skillLevelCrit: int
//  skillLevelTDMG: int
//  memory: % int
//  relics: int
//  steps: int
//  useActives: boolean
// }
var getBestSteps = function(params, method) {
  var relicsLeft = params.relics == 0 ? 1000000000 : params.relics;
  var currentArtifacts = params.artifacts.slice();
  var steps = [];
  var cumulative = 0;
  var stepLimit = params.steps == 0 ? 300 : params.steps;

  // TODO: only relicsLeft or steps
  while (relicsLeft > 0 && steps.length < stepLimit) {
    // array to hold possible upgrades
    var options = [];

    // get initial values
    params.artifacts = currentArtifacts;
    var baseState = new GameState(params);
    var baseValue = getValue(baseState, method, params.actives);

    currentArtifacts.forEach(function(ap, i) {
      var artifact = artifactMapping[ap[0]];

      var level = ap[1];
      if (level == 0 || level == artifact.levelcap) {
        continue;
      }

      // cost to level this artifact
      var relicCost = artifact.costToLevel(level);

      // get value if leveled
      var newArtifacts = currentArtifacts.slice();
      newArtifacts[i][1] += 1;

      // TODO: make this better
      if (method == Methods.GOLD && artifact == artifactInfo.FF) {
        relicCost = 0;
        var levelTo = baseState.nextFFLevel(level);
        newArtifacts[i][1] = levelTo;
        while (levelTo > level) {
          levelTo -= 1;
          relicCost += artifactInfo.FF.costToLevel(levelTo);
        }
      }

      var dmgEFFGold;
      var dmgEFFLevels;
      if (method == Methods.DMG_EQUIVALENT && artifact == artifactInfo.FF) {
        var levelTo = baseState.nextFFLevel(level);
        var ffArtifacts = newArtifacts.slice();
        ffArtifacts[i][1] = levelTo;
        dmgEFFLevels = levelTo - currentArtifacts[i][1];
        params.artifacts = ffArtifacts;
        var ffState = new GameState(params);
        dmgEFFGold = getValue(ffState, Methods.GOLD, params.actives);
      }

      params.artifacts = newArtifacts;
      var newGameState = new GameState(params);
      var newValue = getValue(newGameState, method, params.actives);

      var efficiency;
      if (method == Methods.DMG_EQUIVALENT) {
        var goldRatio = newValue[0] / baseValue[0];
        var tdmgRatio = newValue[1] / baseValue[1];

        // TODO: Make this better
        if (artifact == artifactInfo.FF) {
          goldRatio = 1 + ((dmgEFFGold - baseValue[0]) / dmgEFFLevels) / baseValue[0];
        }

        var goldDmgEquivalent = Math.pow(1.044685, Math.log(goldRatio) / Math.log(1.075));
        var tdmgEquivalentRatio = goldDmgEquivalent * tdmgRatio;
        var tdmgEquivalent = baseValue[1] * tdmgEquivalentRatio;

        efficiency = (tdmgEquivalent - baseValue[1]) / relicCost;
      } else {
        efficiency = (newValue - baseValue) / relicCost;
      }

      options.push({
        index: i,
        name: artifact.name,
        level: newArtifacts[i][1],
        cost: relicCost,
        efficiency: efficiency,
        cumulative: cumulative + relicCost,
      });
    });

    // TODO: add new artifact option

    // pick best option
    var bestOption = getMax(options, function(o1, o2) {
      return o1.efficiency > o2.efficiency;
    });

    // TODO: use all relics options
    // if we don't have enough relics, break
    if (bestOption.cost > relicsLeft && parms.steps == 0) {
      break;
    }

    // update
    relicsLeft -= bestOption.cost;
    cumulative += bestOption.cost;
    currentArtifacts[bestOption.index][1] = bestOption.level;
    steps.push(bestOption);
  }
  return steps;
};

var getSteps = function(params) {
  var response = {};
  params.methods.forEach(function(m, i) {
    var steps = getBestSteps(params, m);
    var summary = {};
    var costs = {};
    steps.forEach(function(s, index) {
      var i = s.index;
      summary[i] = Math.max(s.level, summary[i] ? summary[i] : 0);
      costs[i] = (costs[i] ? costs[i] : 0) + s.cost;
    });
    var summarySteps = [];
    for (var k in summary) {
      var step = {
        index: k,
        name: artifactMapping[i].name,
        level: summary[k],
        cost: costs[k],
      };
      summarySteps.push(step);
    }
    response[m] = {
      steps: steps,
      summary: summarySteps,
    };
  });
  return response;
};
