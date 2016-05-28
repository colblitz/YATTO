var BonusTypes = {
  ALL_DAMAGE_ARTIFACTS:        0,
  ALL_DAMAGE_HEROSKILLS:       1,
  ALL_DAMAGE_CUSTOMIZATIONS:   2,
  TAP_DAMAGE_ARTIFACTS:        3,
  TAP_DAMAGE_HEROSKILLS:       4,
  TAP_DAMAGE_CUSTOMIZATIONS:   5,
  TAP_DAMAGE_DPS               6,
  CRIT_CHANCE:                 7,
  CRIT_DAMAGE_ARTIFACTS:       8,
  CRIT_DAMAGE_HEROSKILLS:      9,
  CRIT_DAMAGE_CUSTOMIZATIONS: 10,
  GOLD_ARTIFACTS:             11,
  GOLD_HEROSKILLS:            12,
  GOLD_CUSTOMIZATIONS:        13,
  GOLD_OVERALL:               14, // gold while playing
  GOLD_MOBS:                  15,
  GOLD_BOSS:                  16,
  GOLD_10X_CHANCE:            17,
  CHEST_ARTIFACTS:            18,
  CHEST_HEROSKILLS:           19,
  CHEST_CUSTOMIZATIONS:       20,
  CHEST_CHANCE:               21,
  INDIVIDUAL_HERO_DAMAGE:     22,
  BOSS_HEALTH:                23,
  BOSS_TIME:                  24,
  BOSS_DAMAGE:                25,
  NUM_MOBS:                   26,
  RELICS:                     27,
  UPGRADE_COST:               28,
  ARTIFACT_DAMAGE_BOOST:      29,
  SKILL_CDR_AUTO:             30,
  SKILL_CDR_CRIT:             31,
  SKILL_CDR_HERO:             32,
  SKILL_CDR_GOLD:             33,
  SKILL_CDR_TDMG:             34,
  SKILL_CDR_OHKO:             35,
  SKILL_DRN_AUTO:             36,
  SKILL_DRN_CRIT:             37,
  SKILL_DRN_HERO:             38,
  SKILL_DRN_GOLD:             39,
  SKILL_DRN_TDMG:             40,
  SKILL_DRN_OHKO:             41,
  HERO_DEATH_CHANCE:          42,
  HERO_REVIVE_TIME:           43,
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



// var Artifact = function(name, ad0, adpl, levelcap, x, y, effect, desc) {
//   this.name = name;
//   this.ad0 = ad0;
//   this.adpl = adpl;
//   this.levelcap = levelcap;
//   if (this.levelcap == 0) {
//     this.levelcap = Infinity;
//   }
//   this.x = x;
//   this.y = y;

//   this.effect = effect;
//   this.description = desc;

//   this.cost = function(level) { return x * Math.pow(level, y) };

//   this.getAD = function(level) {
//     if (level == 0) {
//       return 0;
//     } else {
//       return ad0 + adpl * (level - 1);
//     }
//   };

//   this.costToLevel = function(level) {
//     if (level == 0 || level >= this.levelcap) {
//       return Infinity;
//     } else {
//       return Math.round(this.cost(level + 1)); // TODO: Check if round or floor
//     }
//   };

//   this.costToLevelTo = function(level) {
//     var c = 0;
//     var l = 1;
//     while (l != level) {
//       c += this.costToLevel(l);
//       l += 1;
//     }
//     return c;
//   };

//   this.getDescription = function(level) {
//     var l = Math.max(0, Math.min(level, levelcap));
//     return (l * effect).toString() + "%" + this.description;
//   };
// }

var artifact_info = {
  AOV:       new Artifact("Amulet of the Valrunes",  1,  2, 0.7, 2.0, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  25, BonusTypes.GOLD_MOBS:               10}, ""),
  AXE:       new Artifact("Axe of Resolution",       1, 16, 0.5, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_DRN_TDMG:          10}, ""),
  BM:        new Artifact("Barbarian's Mettle",      1, 10, 0.4, 1.5,   10, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  35, BonusTypes.SKILL_CDR_TDMG:          -5}, ""),
  BREW:      new Artifact("Brew of Absorption",      1, 30, 0.6, 1.7, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  30, BonusTypes.TAP_DAMAGE_ARTIFACTS:     2}, ""),
  CHEST:     new Artifact("Chest of Contentment",    1, 19, 1.0, 1.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.CHEST_ARTIFACTS:         20}, ""),
  ELIXIR:    new Artifact("Crafter's Elixir",        1, 27, 0.5, 1.8, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.GOLD_OVERALL:            15}, ""), // gold while playing
  EGG:       new Artifact("Crown Egg",               1, 18, 1.0, 1.5, null, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  20, BonusTypes.CHEST_CHANCE:            20}, ""),
  CLOAK:     new Artifact("Dark Cloak of Life",      1,  3, 0.5, 2.0,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.BOSS_HEALTH:             -2}, ""),
  DS:        new Artifact("Death Seeker",            1,  4, 0.8, 2.5,   25, {BonusTypes.ALL_DAMAGE_ARTIFACTS:  15, BonusTypes.CRIT_CHANCE:             10}, ""),
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
   ,
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
var artifact_mapping = {};
for (var key in artifact_info) {
  artifact_mapping[artifact_info[key].id] = artifact_info[key];
}

// var artifact_info = [
//   new Artifact("Amulet of the Valrunes",   50,  25,  0, 0.7, 2.0,   10, "gold from monsters"),              //  0 monster gold
//   new Artifact("Axe of Resolution",        70,  35,  0, 0.5, 1.7,   10, "Berserker Rage duration"),         //  1 BR duration
//   new Artifact("Barbarian's Mettle",       70,  35, 10, 0.4, 1.5,   -5, "Berserker Rage cooldown"),         //  2 BR CDR
//   new Artifact("Chest of Contentment",     40,  20,  0, 1.0, 1.5,   20, "Chesterson gold"),                 //  3 chesterson gold
//   new Artifact("Crafter's Elixir",         40,  20,  0, 0.5, 1.8,   15, "gold from all sources"),           //  4 increase gold (multiplicative)
//   new Artifact("Crown Egg",                40,  20,  0, 1.0, 1.5,   20, "base Chesterson chance"),          //  5 chesterson chance
//   new Artifact("Dark Cloak of Life",       30,  15, 25, 0.5, 2.0,   -2, "boss health"),                     //  6 boss life
//   new Artifact("Death Seeker",             30,  15, 25, 0.8, 2.5,   10, "base crit chance"),                //  7 crit chance
//   new Artifact("Divine Chalice",           30,  15,  0, 0.7, 1.7,  0.5, "chance for 10x gold"),             //  8 chance for 10x gold
//   new Artifact("Drunken Hammer",           60,  30,  0, 0.6, 1.7,    2, "tap damage"),                      //  9 tap damage
//   new Artifact("Future's Fortune",         30,  15,  0, 0.7, 2.0,    5, "gold from all sources"),           // 10 increase gold (additive)
//   new Artifact("Hero's Thrust",            30,  15,  0, 0.7, 1.7,   20, "crit damage"),                     // 11 crit damage
//   new Artifact("Hunter's Ointment",       120,  60, 10, 0.4, 1.5,   -5, "War Cry cooldown"),                // 12 WC CDR
//   new Artifact("Knight's Shield",          60,  30,  0, 0.7, 1.5,  100, "gold from bosses"),                // 13 boss gold
//   new Artifact("Laborer's Pendant",        70,  35, 10, 0.7, 1.5,   -5, "Hand of Midas cooldown"),          // 14 HoM CDR
//   new Artifact("Ogre's Gauntlet",          70,  35,  0, 0.5, 1.7,   10, "Shadow Clone duration"),           // 15 SC duration
//   new Artifact("Otherworldly Armor",       70,  35, 10, 1.0, 2.2,   -5, "hero death chance"),               // 16 hero death chance
//   new Artifact("Overseer's Lotion",        70,  35, 10, 0.4, 1.5,   -5, "Shadow Clonse cooldown"),          // 17 SC CDR
//   new Artifact("Parchment of Importance",  70,  35,  0, 0.5, 1.7,   10, "Critical Strike duration"),        // 18 CS duration
//   new Artifact("Ring of Opulence",         70,  35,  0, 0.7, 1.7,   10, "Hand of Midas duration"),          // 19 HoM duration
//   new Artifact("Ring of Wondrous Charm",   30,  15, 25, 0.5, 1.7,   -2, "hero upgrade cost"),               // 20 upgrade cost
//   new Artifact("Sacred Scroll",            70,  35, 10, 0.4, 1.5,   -5, "Critical Strike cooldown"),        // 21 CS CDR
//   new Artifact("Saintly Shield",           70,  35, 10, 0.3, 1.5,   -5, "Heavenly Strike cooldown"),        // 22 HS CDR
//   new Artifact("Savior Shield",            30,  15, 25, 0.5, 1.7,   10, "boss time"),                       // 23 boss time
//   new Artifact("Tincture of the Maker",    10,   5,  0, 0.6, 2.5,    5, "overall all damage"),              // 24 all damage
//   new Artifact("Undead Aura",              30,  15,  0, 0.7, 2.0,    5, "relics from prestige"),            // 25 bonus relics
//   new Artifact("Universal Fissure",       120,  60,  0, 0.5, 1.7,   10, "War Cry duration"),                // 26 WR duration
//   new Artifact("Warrior's Revival",        70,  35, 10, 1.0, 2.2,   -5, "hero revive time"),                // 27 revive time
//   new Artifact("Worldly Illuminator",     300, 150,  5, 0.6, 3.0, -100, "monsters per stage"),              // 28 number of mobs
//   new Artifact("Brew of Absorption",       60,  30,  0, 0.6, 1.7,    2, "overall all damage when online"),  // 29 BR duration
// ];

// var numSkillTypes = 9;
// var STYPE_HERO_DPS     = 0;
// var STYPE_ALL_DAMAGE   = 1;
// var STYPE_CRIT_DAMAGE  = 2;
// var STYPE_TAP_DAMAGE   = 3;
// var STYPE_PERCENT_DPS  = 4;
// var STYPE_CHEST_GOLD   = 5;
// var STYPE_GOLD_DROPPED = 6;
// var STYPE_BOSS_DAMAGE  = 7;
// var STYPE_CRIT_CHANCE  = 8;

var SKILL_LEVELS = {
  1: [10, 25, 50, 100, 200, 400, 800, 1010, 1025, 1050, 1100, 1200, 1400, 1800],
  2: [10, 30, 60, 100, 200, 400, 800, 1010, 1030, 1060, 1100, 1200, 1400, 1800],
};

var level_to_skills = function(world, level) {
  var eqLevel = (level > 1000 ? level - 1000 : level);
  var slevels = SKILL_LEVELS[world].slice(0, 7);
  for (var l in slevels) {
    if (eqLevel < slevels[l]) {
      return l;
    }
  }
  return 7;
}

// var level_to_skills = function(level) {
//   var eqLevel = (level > 1000 ? level - 1000 : level);
//   var slevels = [10, 25, 50, 100, 200, 400, 800];
//   for (var l in slevels) {
//     if (eqLevel < slevels[l]) {
//       return l;
//     }
//   }
//   return 7;
// }

var HERO_UPGRADE_SCALING = 1.075;
var precompute_upgrade_cost = 6000;
var Hero = function(name, id, base_cost, skills) {
  this.name = name;
  this.id = id;
  this.base_cost = base_cost;
  this.skills = skills;

  // base_cost should be of form {1: x, 2: y}
  this.base_cost10 = mapMap(base_cost, c => c*10);
  this.upgrade_costs = mapMap(base_cost, c => [c]);

  // precompute a bunch of upgrade costs
  var m = HERO_UPGRADE_SCALING;
  for (var i = 1; i < precompute_upgrade_cost; i++) {
    for (var w in base_cost) {
      this.upgrade_costs[w].push((i < 1000 ? this.base_cost[w] : this.base_cost10[w]) * m);
      m *= HERO_UPGRADE_SCALING;
    }
  }

  this.evolve_cost = mapMap(this.upgrade_costs, l => 10.75 * l[999]);

  this.get_upgrade_cost = function(world, level) {
    if (level < precompute_upgrade_cost) {
      return this.upgrade_costs[world][level];
    }
    return (level < 1000 ? this.base_cost[world] : this.base_cost10[world]) * Math.pow(HERO_UPGRADE_SCALING, level);
  };

  this.cost_to_level = function(world, start_level, end_level) {
    if (end_level == start_level + 1) {
      return this.get_upgrade_cost(world, start_level);
    }
    if (end_level <= 1000) {
      return this.base_cost[world] * (Math.pow(HERO_UPGRADE_SCALING, end_level) - Math.pow(HERO_UPGRADE_SCALING, start_level)) / (HERO_UPGRADE_SCALING - 1);
    }
    if (start_level >= 1000) {
      return this.base_cost10[world] * (Math.pow(HERO_UPGRADE_SCALING, end_level) - Math.pow(HERO_UPGRADE_SCALING, start_level)) / (HERO_UPGRADE_SCALING - 1);
    }
    return this.cost_to_level(world, start_level, 1000) + this.evolve_cost[world] + this.cost_to_level(world, 1000, end_level);
  };

  this.cost_to_next_skill = mapMap(base_cost, c => []);
  for (var i = 0; i < 2000; i++) {
    for (var w in base_cost) {
      for (var l in SKILL_LEVELS[w]) {
        if (i < SKILL_LEVELS[w][l]) {
          this.cost_to_next_skill[w].push(this.cost_to_level(w, i, SKILL_LEVELS[l]));
          break;
        }
      }
    }
  }

  this.cost_to_buy_skill = function(world, level) {
    if (level < 1000) {
      return 5 * this.get_upgrade_cost(world, level + 1);
    }
    return 0.5 * this.get_upgrade_cost(world, level + 1);
  };


  this.get_cost_to_next_skill = function(world, level) {
    for (var l in SKILL_LEVELS[world]) {
      if (level < SKILL_LEVELS[world][l]) {
        return [SKILL_LEVELS[world][l], this.cost_to_next_skill[world][level]];
      }
    }
    return [0, Infinity];
  };

  this.get_bonuses = function(world, level, btype) {
    var bonus = 0;
    for (var i = 0; i < level_to_skills(world, level); i++) {
      if (skills[world][i][1] == btype) {
        bonus += skills[world][i][0];
      }
    }
    return bonus;
  };

  this.get_base_damage = function(world, level) {
    // HeroInfo.GetDPSByLevel
    var n, m;
    var c = this.get_upgrade_cost(world, level - 1);
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

// var Hero = function(name, id, base_cost, skills) {
//   this.name = name;
//   this.id = id;
//   this.base_cost = base_cost;
//   this.base_cost10 = 10 * base_cost;
//   this.skills = skills;
//   this.upgrade_costs = [base_cost];
//   for (var i = 1; i < precompute_upgrade_cost; i++) {
//     this.upgrade_costs.push((i < 1000 ? this.base_cost : this.base_cost10) * Math.pow(1.075, i));
//   }
//   this.evolve_cost = 10.75 * this.upgrade_costs[999] // TODO: check this

//   this.get_upgrade_cost = function(level) {
//     if (level < precompute_upgrade_cost) {
//       return this.upgrade_costs[level];
//     }
//     return (level < 1000 ? this.base_cost : this.base_cost10) * Math.pow(1.075, level);
//   };

//   this.cost_to_level = function(start_level, end_level) {
//     if (end_level == start_level + 1) {
//       return this.get_upgrade_cost(start_level);
//     }
//     if (end_level <= 1000) {
//       return this.base_cost * (Math.pow(1.075, end_level) - Math.pow(1.075, start_level)) / 0.075;
//     }
//     if (start_level >= 1000) {
//       return this.base_cost10 * (Math.pow(1.075, end_level) - Math.pow(1.075, start_level)) / 0.075;
//     }
//     return this.cost_to_level(start_level, 1000) + this.evolve_cost + this.cost_to_level(1000, end_level);
//   };

//   this.cost_to_next_skill = []
//   for (var i = 0; i < 2000; i++) {
//     for (var l in SKILL_LEVELS) {
//       if (i < SKILL_LEVELS[l]) {
//         this.cost_to_next_skill.push(this.cost_to_level(i, SKILL_LEVELS[l]));
//         break;
//       }
//     }
//   }

//   this.cost_to_buy_skill = function(level) {
//     if (level < 1000) {
//       return 5 * this.get_upgrade_cost(level + 1);
//     }
//     return 0.5 * this.get_upgrade_cost(level + 1);
//   };


//   this.get_cost_to_next_skill = function(level) {
//     for (var l in SKILL_LEVELS) {
//       if (level < SKILL_LEVELS[l]) {
//         return [SKILL_LEVELS[l], this.cost_to_next_skill[level]];
//       }
//     }
//     return [0, Infinity];
//   };

//   this.get_bonuses = function(level, stype) {
//     var bonus = 0;
//     for (var i = 0; i < level_to_skills(level); i++) {
//       if (skills[i][1] == stype) {
//         bonus += skills[i][0];
//       }
//     }
//     return bonus;
//   };

//   this.get_base_damage = function(level) {
//     var n, m;
//     var c = this.get_upgrade_cost(level - 1);
//     if (level >= 1001) {
//       n = Math.max(Math.pow(0.904, level - 1001) * Math.pow(0.715, this.id + 33), 1e-308);
//       m = Math.pow(1.075, level - 1000) - 1;
//     } else {
//       n = Math.max(Math.pow(0.904, level - 1) * Math.pow(1 - (0.019 * Math.min(this.id, 15)), this.id), 1e-308);
//       m = Math.pow(1.075, level) - 1;
//     }
//     return (n * c * m) / 0.75;
//   };
// }
var hero_info = [
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
  // NOT CHECKED
  new Hero("Chester the Beast Tamer", 28, {1: 2850e60, 2: }, {
    1: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.ALL_DAMAGE_HEROSKILLS], [400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[350, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.ALL_DAMAGE_HEROSKILLS], [400, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [600, BonusTypes.INDIVIDUAL_HERO_DAMAGE],
        [20, BonusTypes.CRIT_DAMAGE_HEROSKILLS], [2, BonusTypes.CRIT_CHANCE], [15, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Mohacas the Wind Warrior", 29, {1: 3.14e81, 2: }, {
    1: [[330, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [550, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [20, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.GOLD_HEROSKILLS]],
    2: [[330, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [550, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [20, BonusTypes.GOLD_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Jaqulin the Unknown", 30, {1: 3.14e96, 2: }, {
    1: [[1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.GOLD_HEROSKILLS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[1000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [10, BonusTypes.TAP_DAMAGE_HEROSKILLS], [4, BonusTypes.TAP_DAMAGE_DPS], [20, BonusTypes.GOLD_HEROSKILLS],
        [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS]]}),
  new Hero("Pixie the Rebel Fairy", 31, {1: 3.76e116, 2: }, {
    1: [[900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.CRIT_CHANCE], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [25, BonusTypes.CHEST_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [15, BonusTypes.GOLD_HEROSKILLS]],
    2: [[900, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [1, BonusTypes.CRIT_CHANCE], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [25, BonusTypes.CHEST_HEROSKILLS], [10, BonusTypes.ALL_DAMAGE_HEROSKILLS], [15, BonusTypes.GOLD_HEROSKILLS]]}),
  new Hero("Jackalope the Fireballer", 32, {1: 4.14e136, 2: }, {
    1: [[40, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.GOLD_HEROSKILLS], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [2, BonusTypes.CRIT_CHANCE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.BOSS_DAMAGE]],
    2: [[40, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [25, BonusTypes.GOLD_HEROSKILLS], [60, BonusTypes.TAP_DAMAGE_HEROSKILLS],
        [2, BonusTypes.CRIT_CHANCE], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [10, BonusTypes.BOSS_DAMAGE]]}),
  new Hero("Dark Lord, Punisher of All", 33, {1: 456e156, 2: }, {
    1: [[2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.TAP_DAMAGE_HEROSKILLS], [1, BonusTypes.TAP_DAMAGE_DPS], [25, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [40, BonusTypes.ALL_DAMAGE_HEROSKILLS]],
    2: [[2000, BonusTypes.INDIVIDUAL_HERO_DAMAGE], [20, BonusTypes.TAP_DAMAGE_HEROSKILLS], [1, BonusTypes.TAP_DAMAGE_DPS], [25, BonusTypes.GOLD_HEROSKILLS],
        [20, BonusTypes.ALL_DAMAGE_HEROSKILLS], [30, BonusTypes.ALL_DAMAGE_HEROSKILLS], [40, BonusTypes.ALL_DAMAGE_HEROSKILLS]]})];

// var TOTAL_STYPE_GOLD_DROPPED = 0;
// for (var h in hero_info) {
//   for (var s in hero_info[h].skills) {
//     if (hero_info[h].skills[s][1] == STYPE_GOLD_DROPPED) {
//       TOTAL_STYPE_GOLD_DROPPED += hero_info[h].skills[s][0];
//     }
//   }
// }

// var getOrderList = function() {
//   return [
//     13, //  1 Knight's Shield
//      0, //  2 Amulet of the Valrunes
//      6, //  3 Dark Cloak of Life
//      7, //  4 Death Seeker
//     23, //  5 Savior Shield
//     17, //  6 Overseer's Lotion
//     21, //  7 Sacred Scroll
//     12, //  8 Hunter's Ointment
//     14, //  9 Laborer's Pendant
//      2, // 10 Barbarian's Mettle
//     22, // 11 Saintly Shield
//     15, // 12 Ogre's Gauntlet
//     18, // 13 Parchment of Importance
//     26, // 14 Universal Fissure
//     19, // 15 Ring of Opulence
//      1, // 16 Axe of Resolution
//     11, // 17 Hero's Thrust
//      5, // 18 Crown Egg
//      3, // 19 Chest of Contentment
//     10, // 20 Future's Fortune
//      8, // 21 Divine Chalice
//     25, // 22 Undead Aura
//     27, // 23 Warrior's Revival
//     20, // 24 Ring of Wondrous Charm
//     28, // 25 Worldly Illuminator
//     24, // 26 Tincture of the Maker
//      4, // 27 Crafter's Elixir
//     16, // 28 Otherworldly Armor
//      9, // 29 Drunken Hammer
//     29  // 30 Brew of Absorption
//     ];
// };

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
  this.label = label;
  this.value = value;
  this.cost = cost;
  this.ctype = ctype;
  this.type = cMapping[label[0]]; // acts as index
  this.bonus = cBonus[this.type];
}

// var cMapping = {
//   "0": 2, // gold dropped - hats
//   "1": 1, // crit damage - scarves
//   "2": 4, // crit chance - shirts
//   "3": 0, // all damage - swords
//   "4": 5, // tap damage - trails
//   "5": 3  // chest gold - auras
// };

// var CTYPE_D = 0;
// var CTYPE_P = 1;
// var CTYPE_T = 2;
// var CTYPE_S = 3;
// var CTYPE_N = 4;

// var Customization = function(name, value, cost, ctype, label) {
//   this.name = name;
//   this.label = label;
//   this.value = value;
//   this.cost = cost;
//   this.ctype = ctype;
//   this.type = cMapping[label[0]];
// }

var customization_info = [
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

var customizationValues = {};
var customizationMax = [0, 0, 0, 0, 0, 0];
customization_info.forEach(function(c, i) {
  var v = c.value / 100;
  customizationValues[c.label] = c.value / 100;
  customizationMax[c.type] += v;
});
console.log(customizationMax);

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



// var next_ff_level = function(ff, c_gd) {
//   var new_level = ff;
//   var multiplier = function(l) {
//     return Math.ceil(1 + 0.05 * l + TOTAL_STYPE_GOLD_DROPPED + c_gd);
//   }
//   while (multiplier(new_level) == multiplier(ff)) {
//     new_level += 1;
//   }
//   return new_level;
// };

var all_damage = function(artifacts) {
  var total_ad = 0;
  for (var i in artifacts) {
    total_ad += artifact_info[i].getAD(artifacts[i]);
  }
  total_ad *= (1 + 0.05 * artifacts[24]);
  return Math.round(total_ad);
};

var cost_to_buy_next = function(artifacts) {
  if (! 0 in artifacts) {
    return Infinity;
  }
  var owned = artifacts.filter(function(l) { return l != 0; }).length + 1;
  return Math.floor(owned * Math.pow(1.35, owned));
};

var get_hero_weapon_bonuses = function(weapons) {
  return weapons.map(function(n) { return 1 + 0.5 * n; });
};

var number_of_sets = function(weapons) {
  return Math.min.apply(null, weapons);
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

var boss_hp = function(stage) {
  switch (stage % 10) {
    case 1:
    case 6:
      return stage_hp(stage) * 2;
    case 2:
    case 7:
      return stage_hp(stage) * 4;
    case 3:
    case 8:
      return stage_hp(stage) * 6;
    case 4:
    case 9:
      return stage_hp(stage) * 7;
    case 5:
    case 0:
      return stage_hp(stage) * 10;
  }
}

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
//BOSS_CONSTANT = 6;

var newZeroes = function(length) {
  return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

var sumArray = function(array) {
  return array.reduce(function(a, b) { return a + b; });
};

var BASE_CRIT_CHANCE = 0.02;
var BASE_CHEST_CHANCE = 0.02;
var GameState = function(artifacts, weapons, levels, customizations, others) {
  this.artifacts = artifacts.slice();
  this.a_ad = 0.01 * all_damage(this.artifacts);
  this.l_amulet    = artifacts[0];
  this.l_axe       = artifacts[1];
  this.l_chest     = artifacts[3];
  this.l_elixir    = artifacts[4];
  this.l_egg       = artifacts[5];
  this.l_dseeker   = artifacts[7];
  this.l_chalice   = artifacts[8];
  this.l_hammer    = artifacts[9];
  this.l_fortune   = artifacts[10];
  this.l_hthrust   = artifacts[11];
  this.l_kshield   = artifacts[13];
  this.l_parchment = artifacts[18];
  this.l_charm     = artifacts[20];
  this.l_ua        = artifacts[25];
  this.l_world     = artifacts[28];
  this.l_brew      = artifacts[29];
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

  this.others = others ? others : {};

  this.c_chance = Math.min(1, BASE_CHEST_CHANCE + 0.004 * this.l_egg);
  this.n_chance = 1 - this.c_chance;

  this.n_gold = 1 + 0.1 * this.l_amulet;
  this.d_chance = Math.min(1, 0.005 * this.l_chalice);
  this.d_multiplier = 1 - this.d_chance + 10 * this.d_chance;
  this.m_multiplier = this.n_chance * this.n_gold * this.d_multiplier;
  this.boss_gold = BOSS_CONSTANT * (1 + this.l_kshield);

  // this.other_total = (1 + this.c_gd) * (1 + 0.15 * this.l_elixir) * (1 / (1 - 0.02 * this.l_charm));
  this.other_total = (1 + 0.15 * this.l_elixir) * (1 / (1 - 0.02 * this.l_charm));

  this.heroes = levels.slice();
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
    for (var i = 0; i < this.heroes.length; i++) {
      var skills = level_to_skills(this.heroes[i]);
      for (var s = 0; s < skills; s++) {
        this.add_skill(i, s);
        this.hero_skills[i] = s;
      }
    }
  };

  this.total_relics = function() {
    if (this.current_stage < 90) {
      return 0;
    }
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
    //var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd) * this.other_total;
    var multiplier_total = Math.ceil(1 + 0.05 * this.l_fortune + h_gd + this.c_gd) * this.other_total;

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

//   public double GetStageBaseGold(int stage)
// {
//     double num2 = this.GetStageBaseHP(stage) * (ServerVarsModel.monsterGoldMultiplier + (ServerVarsModel.monsterGoldSlope * Math.Min((float) this.currentStage, ServerVarsModel.noMoreMonsterGoldSlope)));
//     return (num2 * Math.Ceiling((double) (1.0 + PlayerModel.instance.GetStatBonus(BonusType.GoldAll))));
// }




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
    return Math.min(1, BASE_CRIT_CHANCE + 0.02 * this.l_dseeker + this.c_cc + h_cc);
  };

  this.get_hero_dps = function() {
    var dps = 0;
    var h_ad = this.get_total_bonus(STYPE_ALL_DAMAGE);
    for (var i in this.heroes) {
      var level = this.heroes[i];
      if (level == 0) {
        continue;
      }

      // console.log("memory: ", this.others.memory);
      var hero_dps = hero_info[i].get_base_damage(level);
      var m_hero = 1 + hero_info[i].get_bonuses(level, STYPE_HERO_DPS) + h_ad + this.others.memory;
      var m_artifact = 1 + this.a_ad;
      var m_customization = 1 + this.c_ad;
      var m_weapon = this.w_bh[i];
      var m_set = this.w_sb;

      hero_dps = hero_dps * m_hero * m_artifact * m_customization * m_weapon * m_set;
      dps += hero_dps;
    }
    return dps;
  };

  // (num * (1.0 + statBonus) + num4) * (1.0 + num3) * (1.0 + num5)

  // (((( * ) * ) * (1.0 + artifactDamageBonus)) * (1.0 + num7)) * (1.0 + num8);


  this.tap_damage = function() {
    var h_ad = this.get_total_bonus(STYPE_ALL_DAMAGE);
    var h_td = this.get_total_bonus(STYPE_TAP_DAMAGE);
    var h_pd = this.get_total_bonus(STYPE_PERCENT_DPS);
    var h_cd = this.get_total_bonus(STYPE_CRIT_DAMAGE);
    var h_cc = this.get_total_bonus(STYPE_CRIT_CHANCE);

    var hero_total_dps = this.get_hero_dps();
    // console.log("hero_total_dps: ", hero_total_dps);

    // from_main = MAIN_LEVEL * pow(1.05, MAIN_LEVEL) * (1 + h_ad)
    var from_main = this.main_dmg * (1 + h_ad);
    var from_hero = (h_pd * hero_total_dps);
    console.log(from_main);
    console.log(from_hero);
    var total = from_main + from_hero;
    var total_tap = total * (1 + h_td + this.c_td) * (1 + this.a_ad) * (1 + 0.02 * this.l_hammer + 0.02 * this.l_brew) * (1 + this.c_ad);
    // var total_tap = from_main + from_hero;

    var crit_multiplier = this.get_crit_multiplier();
    var crit_chance = this.get_crit_chance();

    var overall_crit_multiplier = ((1 - crit_chance) + (crit_chance * 0.65 * crit_multiplier));
    var total_tapping = total_tap * overall_crit_multiplier;

    var a_crit_uptime = this.l_parchment > 0 ? Math.min((30 + 3 * this.l_parchment) / 900, 1) : 0;
    var a_crit_bonus = this.others.cs > 0 ? Math.min((0.17 + (this.others.cs - 1) * 0.03), 1) : 0;

    // var a_crit_chance = Math.min(1, crit_chance + a_crit_uptime * a_crit_bonus);
    var a_crit_chance = Math.min(crit_chance * (1 - a_crit_uptime) + Math.min(1, crit_chance + a_crit_bonus) * a_crit_uptime, 1);
    var a_overall_crit_multiplier = ((1 - a_crit_chance) + (a_crit_chance * 0.65 * crit_multiplier));

    var a_tap_uptime = this.l_axe > 0 ? Math.min((30 + 3 * this.l_axe) / 1800, 1) : 0;
    var a_tap_bonus = this.others.br > 0 ? (0.70 + (this.others.br - 1) * 0.3) : 0;

    var a_total_tapping = total_tap * a_overall_crit_multiplier * (1 + a_tap_uptime * a_tap_bonus);

    return [total_tap, total_tapping, a_total_tapping];
  };

  this.get_dmg_equivalent = function(game_state) {
    var gold_multiplier = this.gold_multiplier();
    var dmg_multiplier = this.tap_damage()[1];
    var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_multiplier) / Math.log(1.075));
    var dmg_equivalent = dmg_multiplier + gold_dmg_equivalent;
    return dmg_equivalent;
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
    if (last_owned != -1) {
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
        // TODO: check this, hero_skills
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

    // level your last hero as much as possible
    var owned = heroes_after.filter(function(h) { return h != 0; });
    var last_owned = owned.length - 1;
    var level_last = heroes_after[last_owned];

    // TODO: javascript is stupid
    if (last_owned != -1) {
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
    }

    for (var i in heroes_after) {
      var level = heroes_after[i];
      if (level == 1000 && hero_info[i].evolve_cost < this.current_gold) {
        heroes_after[i] += 1;
        this.current_gold -= hero_info[i].evolve_cost;
      }
    }
    this.heroes = heroes_after;
  };

  // TODO: Use this to figure out when to prestige
  this.calculate_rps_per_stage = function() {
    var TAPS_PER_SECOND = 10;
    this.new_run();

    var done = false;
    var rps = {};
    var mobs = 10 - this.l_world;
    while (!done) {
      var temp = this.tap_damage();
      var tapping = temp[1];
      var dps = TAPS_PER_SECOND * tapping;

      var mobs_health = stage_hp(this.current_stage);
      var boss_health = boss_hp(this.current_stage);

      var base_time = 0.75; // 4.5/6
      var mobs_time = base_time + Math.ceil(mobs_health / tapping) / TAPS_PER_SECOND;
      var boss_time = base_time + Math.ceil(boss_health / tapping) / TAPS_PER_SECOND;
      var total_time = mobs * mobs_time + boss_time;

      if (boss_time > 5) {
        // cannot kill boss in 5 seconds, see if we want to grind
        var owned_heroes = this.heroes.filter(function(h) { return h != 0; });
        var next_hero = owned_heroes.length;
        var grind_target = 0;
        if (next_hero == 33 && this.heroes[32] < 1001) {

          grind_target = hero_info[32].evolve_cost;
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

        var mob_gold = this.mob_multiplier() * base_stage_gold(this.current_stage);
        if (gold_needed < 10000 * mob_gold) {
          this.current_gold += mob_gold;
          this.time += mobs_time;
        } else {
          done = true;
          continue;
        }
      } else {
        // Pass stage
        this.current_gold += this.gold_for_stage(this.current_stage);
        if (this.current_stage % 5 == 0) {
          this.level_heroes();
        }
        this.time += total_time;
        this.current_stage += 1;
        rps[this.current_stage] = [this.total_relics() / this.time, boss_time];
      }
    }
  }

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
        grind_target = hero_info[32].evolve_cost;
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
var METHOD_DMG_EQUIVALENT = 3;
var METHOD_RELICS_PS = 4;
var METHOD_STAGE_PS = 5;

var METHOD_TAP_DAMAGE_WITH_ACTIVES = 6;
var METHOD_DMG_EQUIVALENT_WITH_ACTIVES = 7;

// var next_ff_level = function(ff, c_gd) {
//   var new_level = ff;
//   var multiplier = function(l) {
//     return Math.ceil(1 + 0.05 * l + TOTAL_STYPE_GOLD_DROPPED + c_gd);
//   }
//   while (multiplier(new_level) == multiplier(ff)) {
//     new_level += 1;
//   }
//   return new_level;
// };


var get_value = function(game_state, method) {
  switch (method) {
    case METHOD_GOLD:
      return game_state.gold_multiplier();
    case METHOD_ALL_DAMAGE:
      return game_state.a_ad;
    case METHOD_TAP_DAMAGE:
      return game_state.tap_damage()[1];
    case METHOD_DMG_EQUIVALENT:
    // console.log("dmge");
    // console.log(game_state.gold_multiplier());
    // console.log(game_state.tap_damage());
      return [game_state.gold_multiplier(), game_state.tap_damage()[1]];
    case METHOD_RELICS_PS:
      return game_state.relics_per_second()[2];
    case METHOD_STAGE_PS:
      return game_state.relics_per_second().slice(0, 2);
    case METHOD_TAP_DAMAGE_WITH_ACTIVES:
      return game_state.tap_damage()[2];
    case METHOD_DMG_EQUIVALENT_WITH_ACTIVES:
      return [game_state.gold_multiplier(), game_state.tap_damage()[2]];
  }
};

var hashArray = function(array) {
  // TODO: find better hash?
  return array.toString();
};

var memoize = {};
var get_value_memoize = function(a, p, mo) {
  var w = p.w;
  var l = p.l;
  var c = p.c;
  var m = mo;
  if (p.s && m == METHOD_TAP_DAMAGE) {
    m = METHOD_TAP_DAMAGE_WITH_ACTIVES;
  } else if (p.s && m == METHOD_DMG_EQUIVALENT) {
    m = METHOD_DMG_EQUIVALENT_WITH_ACTIVES;
  }

  var aHash = m + hashArray(a);
  if (aHash in memoize) {
    return memoize[aHash];
  } else {
    var g = new GameState(a, w, l, c, { cs: p.t, br: p.z, memory: p.y });
    // if rps or sps, will reset anyways
    g.get_all_skills();
    var base = get_value(g, m);
    memoize[aHash] = base;
    return base;
  }
};

var get_max = function(array, custom) {
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

// artifacts, weapons, levels, customizations, relics, nsteps, method
var get_best = function(params, method) {
  var relics_left = params.r == 0 ? 1000000000 : params.r;
  var current_artifacts = params.a.slice();
  var steps = [];
  var cumulative = 0;

  var stepLimit = params.n == 0 ? 200 : params.n

  while (relics_left > 0 && steps.length < stepLimit) {
    var options = [];
    var base = get_value_memoize(current_artifacts, params, method);
    // console.log("base:", base);

    for (var i in current_artifacts) {
      var level = current_artifacts[i];
      if (level == 0 || level == artifact_info[i].levelcap) {
        continue;
      }
      var relic_cost = artifact_info[i].costToLevel(level);
      var artifacts_copy = current_artifacts.slice();
      artifacts_copy[i] += 1;

      // console.log(artifact_info[i].name);

      // Future's Fortune for gold
      if (method == METHOD_GOLD && i == 10) {
        relic_cost = 0;
        // TODO: next_ff_level needs hero skills
        var level_to = next_ff_level(current_artifacts[i], params.c[2]);
        artifacts_copy[i] = level_to;
        while (level_to > level) {
          level_to -= 1;
          relic_cost += artifact_info[i].costToLevel(level_to);
        }
      }

      // Future's Fortune for dmg_equivalent
      var ff_dmg_eq_gold;
      var ff_dmg_eq_levels;
      if ((method == METHOD_DMG_EQUIVALENT || method == METHOD_DMG_EQUIVALENT_WITH_ACTIVES) && i == 10) {
        // TODO: next_ff_level needs hero skills
        var level_to = next_ff_level(current_artifacts[i], params.c[2]);
        var ff_gold_artifacts_copy = current_artifacts.slice();
        ff_gold_artifacts_copy[i] = level_to;
        ff_dmg_eq_levels = level_to - current_artifacts[i];
        ff_dmg_eq_gold = get_value_memoize(ff_gold_artifacts_copy, params, METHOD_GOLD);
      }

      var new_value = get_value_memoize(artifacts_copy, params, method);
      var e;
      if (method == METHOD_STAGE_PS) {
        e = [(new_value[0] - base[0]) / relic_cost, (base[1] - new_value[1]) / relic_cost];
      } else if (method == METHOD_DMG_EQUIVALENT || method == METHOD_DMG_EQUIVALENT_WITH_ACTIVES) {
        // https://www.reddit.com/r/TapTitans/comments/35e0wd/relationship_between_gold_and_damage/
        var gold_ratio = new_value[0] / base[0];
        if (i == 10) {
          gold_ratio = 1 + ((ff_dmg_eq_gold - base[0]) / ff_dmg_eq_levels) / base[0];
        }
        var tdmg_ratio = new_value[1] / base[1];
        var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_ratio) / Math.log(1.075));
        // var total_change = tdmg_ratio * gold_dmg_equivalent;

        // e = (total_change - 1) / relic_cost;

        var eq_tdmg = (gold_dmg_equivalent - 1) * base[1] + new_value[1];
        // console.log((eq_tdmg - base[1]));
        // console.log(relic_cost);
        e = (eq_tdmg - base[1]) / relic_cost;
      } else {
        e = (new_value - base) / relic_cost;
      }

      options.push({
        efficiency: e,
        index: i,
        name: artifact_info[i].name,
        level: artifacts_copy[i],
        cost: relic_cost,
        cumulative: cumulative + relic_cost
      });
    }

    // console.log(options);

    // pick best option
    var best_option = get_max(options, function(o1, o2) {
      if (method != METHOD_STAGE_PS) {
        return o1.efficiency > o2.efficiency;
      } else {
        if (o1.efficiency[0] > o2.efficiency[0]) {
          return true;
        } else if (o1.efficiency[0] < o2.efficiency[0]) {
          return false;
        }
        return o1.efficiency[1] > o2.efficiency[1];
      }
    });

    if (best_option.cost > relics_left && params.n == 0) {
      break;
    }
    relics_left -= best_option.cost;
    cumulative += best_option.cost;
    current_artifacts[best_option.index] = best_option.level;
    delete best_option.efficiency;
    steps.push(best_option);
  }
  return steps;
};

var get_steps = function(params) {
  // reset cache
  memoize = {};
  var response = {};
  for (var mi in params.m) {
    var m = params.m[mi];
    var steps = get_best(params, m);
    // var steps = [];
    // if (params.g == 1) {
    //  steps = get_best(params, m);
    // } else {
    //  // TODO: shouldn't get here yet
    //  // steps = get_best_dp(artifacts, weapons, customizations, relics, nsteps, m, [])[1];
    // }
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
  var total = sumArray(weapons);
  if (total == 0) {
    return 1;
  }
  var expected = total / hero_info.length;
  var chi2 = 0;
  for (var i in weapons) {
    chi2 += Math.pow(weapons[i] - expected, 2) / expected;
  }
  var p = pochisq(chi2, hero_info.length - 1)
  return p;
};

 /*  The following JavaScript functions for calculating normal and
    chi-square probabilities and critical values were adapted by
    John Walker from C implementations
    written by Gary Perlman of Wang Institute, Tyngsboro, MA
    01879.  Both the original C code and this JavaScript edition
    are in the public domain.  */

/*  POZ  --  probability of normal z value

  Adapted from a polynomial approximation in:
      Ibbetson D, Algorithm 209
      Collected Algorithms of the CACM 1963 p. 616
  Note:
      This routine has six digit accuracy, so it is only useful for absolute
      z values < 6.  For z values >= to 6.0, poz() returns 0.0.
*/

var poz = function poz() {
  var y, x, w;
  var Z_MAX = 6.0;              /* Maximum meaningful z value */

  if (z == 0.0) {
    x = 0.0;
  } else {
    y = 0.5 * Math.abs(z);
    if (y >= (Z_MAX * 0.5)) {
      x = 1.0;
    } else if (y < 1.0) {
      w = y * y;
      x = ((((((((0.000124818987 * w
        - 0.001075204047) * w + 0.005198775019) * w
        - 0.019198292004) * w + 0.059054035642) * w
        - 0.151968751364) * w + 0.319152932694) * w
        - 0.531923007300) * w + 0.797884560593) * y * 2.0;
    } else {
      y -= 2.0;
      x = (((((((((((((-0.000045255659 * y
        + 0.000152529290) * y - 0.000019538132) * y
        - 0.000676904986) * y + 0.001390604284) * y
        - 0.000794620820) * y - 0.002034254874) * y
        + 0.006549791214) * y - 0.010557625006) * y
        + 0.011630447319) * y - 0.009279453341) * y
        + 0.005353579108) * y - 0.002141268741) * y
        + 0.000535310849) * y + 0.999936657524;
    }
  }
  return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
}

var BIGX = 20.0;                  /* max value to represent exp(x) */

var ex = function (x) {
  return (x < -BIGX) ? 0.0 : Math.exp(x);
}

/*  POCHISQ  --  probability of chi-square value

Adapted from:
  Hill, I. D. and Pike, M. C.  Algorithm 299
  Collected Algorithms for the CACM 1967 p. 243
Updated for rounding errors based on remark in
  ACM TOMS June 1985, page 185
*/

var pochisq = function(x, df) {
  var a, y, s;
  var e, c, z;
  var even;                     /* True if df is an even number */

  var LOG_SQRT_PI = 0.5723649429247000870717135; /* log(sqrt(pi)) */
  var I_SQRT_PI = 0.5641895835477562869480795;   /* 1 / sqrt(pi) */

  if (x <= 0.0 || df < 1) {
    return 1.0;
  }

  a = 0.5 * x;
  even = !(df & 1);
  if (df > 1) {
    y = ex(-a);
  }
  s = (even ? y : (2.0 * poz(-Math.sqrt(x))));
  if (df > 2) {
    x = 0.5 * (df - 1.0);
    z = (even ? 1.0 : 0.5);
    if (a > BIGX) {
      e = (even ? 0.0 : LOG_SQRT_PI);
      c = Math.log(a);
      while (z <= x) {
        e = Math.log(z) + e;
        s += ex(c * z - a - e);
        z += 1.0;
      }
      return s;
    } else {
      e = (even ? 1.0 : (I_SQRT_PI / Math.sqrt(a)));
      c = 0.0;
      while (z <= x) {
        e = e * (a / z);
        c = c + e;
        z += 1.0;
      }
      return c * y + s;
    }
  } else {
    return s;
  }
}