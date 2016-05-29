// Hero functions
  // this.getUpgradeCost = function(world, level) {
  //   if (level < PRECOMPUTE_UPGRADE_COST) {
  //     return this.upgradeCosts[world][level];
  //   }
  //   return (level < 1000 ? this.baseCost[world] : this.baseCost10[world]) * Math.pow(HERO_UPGRADE_SCALING, level);
  // };

  // this.costToLevel = function(world, startLevel, endLevel) {
  //   if (endLevel == startLevel + 1) {
  //     return this.getUpgradeCost(world, startLevel);
  //   }
  //   if (endLevel <= 1000) {
  //     return this.baseCost[world] * (Math.pow(HERO_UPGRADE_SCALING, endLevel) - Math.pow(HERO_UPGRADE_SCALING, startLevel)) / (HERO_UPGRADE_SCALING - 1);
  //   }
  //   if (startLevel >= 1000) {
  //     return this.baseCost10[world] * (Math.pow(HERO_UPGRADE_SCALING, endLevel) - Math.pow(HERO_UPGRADE_SCALING, startLevel)) / (HERO_UPGRADE_SCALING - 1);
  //   }
  //   return this.costToLevel(world, startLevel, 1000) + this.evolve_cost[world] + this.costToLevel(world, 1000, endLevel);
  // };

  // this.costToNextSkill = mapMap(baseCost, c => []);
  // for (var i = 0; i < 2000; i++) {
  //   for (var w in baseCost) {
  //     for (var l in SKILL_LEVELS[w]) {
  //       if (i < SKILL_LEVELS[w][l]) {
  //         this.costToNextSkill[w].push(this.costToLevel(w, i, SKILL_LEVELS[l]));
  //         break;
  //       }
  //     }
  //   }
  // }

  // this.costToBuySkill = function(world, level) {
  //   if (level < 1000) {
  //     return 5 * this.getUpgradeCost(world, level + 1);
  //   }
  //   return 0.5 * this.getUpgradeCost(world, level + 1);
  // };


  // this.getCostToNextSkill = function(world, level) {
  //   for (var l in SKILL_LEVELS[world]) {
  //     if (level < SKILL_LEVELS[world][l]) {
  //       return [SKILL_LEVELS[world][l], this.costToNextSkill[world][level]];
  //     }
  //   }
  //   return [0, Infinity];
  // };


var nextBossStage = function(stage) {
  // if on boss stage returns that stage, because haven't beat it yet
  return Math.floor(Math.ceil(stage * 0.2)) * 5;
};

// *
var stageHP = function(stage) {
  // StageController.GetStageBaseHP
  if (stage <= MONSTER_HP_LEVEL_OFF) {
    return MONSTER_HP_MULTIPLIER * Math.pow(MONSTER_HP_BASE_1, stage);
  }
  return STAGE_CONSTANT * Math.pow(MONSTER_HP_BASE_2, stage - MONSTER_HP_LEVEL_OFF);
}

// *
var bossHP = function(stage) {
  // var multiplier = (stage % 5) * 2;
  // if (stage == 4 || stage == 9) { multiplier--; }
  // return stageHP(stage) * multiplier;

  switch (stage % 10) {
    case 1:
    case 6:
      return stageHP(stage) * 2;
    case 2:
    case 7:
      return stageHP(stage) * 4;
    case 3:
    case 8:
      return stageHP(stage) * 6;
    case 4:
    case 9:
      return stageHP(stage) * 7;
    case 5:
    case 0:
      return stageHP(stage) * 10;
  }
};

// *
var LOG117 = Math.log(1.17);
var LOG157 = Math.log(1.57);
var healthToStage = function(health) {
  if (health > STAGE_CONSTANT) {
    return Math.round(Math.log(health / STAGE_CONSTANT) / LOG117 + MONSTER_HP_LEVEL_OFF);
  } else {
    return Math.round(Math.log(health / MONSTER_HP_MULTIPLIER) / LOG157);
  }
};

// *
var baseStageGold = function(stage) {
  return stageHP(stage) * (0.02 + 0.00045 * Math.min(stage, 150));
};


// Game state functions

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