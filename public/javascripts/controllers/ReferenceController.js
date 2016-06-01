yattoApp.controller('ReferenceController',
  function($scope, $rootScope, localStorageService) {
    MathJax.Hub.Configured();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);


    // dps increases AD of all artifacts
    // 10x is normal only
    // (additive with hero skills and customizations)
    var bonusTypeText = {};
    var asdf = [
      [BonusTypes.ARTIFACT_DAMAGE_BOOST, "DPS"],
      [BonusTypes.BOSS_HEALTH, "Boss Health"],
      [BonusTypes.BOSS_TIME, "Boss Time"],
      [BonusTypes.CHEST_ARTIFACTS, "Chesterson Gold"],
      [BonusTypes.CHEST_CHANCE, "Chesterson Chance"],
      [BonusTypes.CRIT_CHANCE, "Crit Chance"],
      [BonusTypes.CRIT_DAMAGE_ARTIFACTS, "Crit Damage"],
      [BonusTypes.GOLD_10X_CHANCE, "Chance for 10x"],
      [BonusTypes.GOLD_ARTIFACTS, "Overall Gold (*)"],
      [BonusTypes.GOLD_BOSS, "Boss Gold"],
      [BonusTypes.GOLD_MOBS, "Mob Gold"],
      [BonusTypes.GOLD_OVERALL, "Overall Gold"],
      [BonusTypes.HERO_DEATH_CHANCE, "Hero Death Chance"],
      [BonusTypes.HERO_REVIVE_TIME, "Hero Revive Time"],
      [BonusTypes.NUM_MOBS, "Monsters each stage"],
      [BonusTypes.RELICS, "Relics from prestige"],
      [BonusTypes.SKILL_CDR_AUTO, "Auto Skill cooldown"],
      [BonusTypes.SKILL_CDR_CRIT, "Crit Skill cooldown"],
      [BonusTypes.SKILL_CDR_GOLD, "Gold Skill cooldown"],
      [BonusTypes.SKILL_CDR_HERO, "Hero Skill cooldown"],
      [BonusTypes.SKILL_CDR_OHKO, "OHKO Skill cooldown"],
      [BonusTypes.SKILL_CDR_TDMG, "TDmg Skill cooldown"],
      [BonusTypes.SKILL_DRN_AUTO, "Auto Skill duration"],
      [BonusTypes.SKILL_DRN_CRIT, "Crit Skill duration"],
      [BonusTypes.SKILL_DRN_GOLD, "Gold Skill duration"],
      [BonusTypes.SKILL_DRN_HERO, "Hero Skill duration"],
      [BonusTypes.SKILL_DRN_TDMG, "TDmg Skill duration"],

      // [BonusTypes.SKILL_CDR_AUTO, "Shadow Clone/Summon Golem cooldown"],
      // [BonusTypes.SKILL_CDR_CRIT, "Critical Strike/Poisonous Touch cooldown"],
      // [BonusTypes.SKILL_CDR_GOLD, "Hand of Midas/Chesterson Streak cooldown"],
      // [BonusTypes.SKILL_CDR_HERO, "War Cry/Inspiring Presence cooldown"],
      // [BonusTypes.SKILL_CDR_OHKO, "Heavenly Strike/Heroic Burst cooldown"],
      // [BonusTypes.SKILL_CDR_TDMG, "Berserker Rage/Arcane Channeling cooldown"],
      // [BonusTypes.SKILL_DRN_AUTO, "Shadow Clone/Summon Golem duration"],
      // [BonusTypes.SKILL_DRN_CRIT, "Critical Strike/Poisonous Touch duration"],
      // [BonusTypes.SKILL_DRN_GOLD, "Hand of Midas/Chesterson Streak duration"],
      // [BonusTypes.SKILL_DRN_HERO, "War Cry/Inspiring Presence duration"],
      // [BonusTypes.SKILL_DRN_TDMG, "Berserker Rage/Arcane Channeling duration"],
      [BonusTypes.TAP_DAMAGE_ARTIFACTS, "Tap Damage"],
      [BonusTypes.UPGRADE_COST, "Upgrade Cost"],
    ];
    asdf.forEach(function(p, i) { bonusTypeText[p[0]] = p[1]; });

    var bTypeClasses = {
      "bonusDmg":   [BonusTypes.ARTIFACT_DAMAGE_BOOST,
                     BonusTypes.BOSS_HEALTH,
                     BonusTypes.CRIT_CHANCE,
                     BonusTypes.CRIT_DAMAGE_ARTIFACTS,
                     BonusTypes.TAP_DAMAGE_ARTIFACTS],
      "bonusGold":  [BonusTypes.CHEST_ARTIFACTS,
                     BonusTypes.CHEST_CHANCE,
                     BonusTypes.GOLD_10X_CHANCE,
                     BonusTypes.GOLD_ARTIFACTS,
                     BonusTypes.GOLD_BOSS,
                     BonusTypes.GOLD_MOBS,
                     BonusTypes.GOLD_OVERALL,
                     BonusTypes.UPGRADE_COST],
      "bonusSkill": [BonusTypes.SKILL_CDR_AUTO,
                     BonusTypes.SKILL_CDR_CRIT,
                     BonusTypes.SKILL_CDR_GOLD,
                     BonusTypes.SKILL_CDR_HERO,
                     BonusTypes.SKILL_CDR_OHKO,
                     BonusTypes.SKILL_CDR_TDMG,
                     BonusTypes.SKILL_DRN_AUTO,
                     BonusTypes.SKILL_DRN_CRIT,
                     BonusTypes.SKILL_DRN_GOLD,
                     BonusTypes.SKILL_DRN_HERO,
                     BonusTypes.SKILL_DRN_TDMG],
      "bonusOther": [BonusTypes.BOSS_TIME,
                     BonusTypes.HERO_DEATH_CHANCE,
                     BonusTypes.HERO_REVIVE_TIME,
                     BonusTypes.NUM_MOBS,
                     BonusTypes.RELICS],
    };

    var bonusTypeClasses = {};
    for (var bClass in bTypeClasses) {
      bTypeClasses[bClass].forEach(function(b, i) {
        bonusTypeClasses[b] = bClass;
      });
    }

    var bonusCooldowns = [
      BonusTypes.SKILL_CDR_AUTO,
      BonusTypes.SKILL_CDR_CRIT,
      BonusTypes.SKILL_CDR_GOLD,
      BonusTypes.SKILL_CDR_HERO,
      BonusTypes.SKILL_CDR_OHKO,
      BonusTypes.SKILL_CDR_TDMG,
    ];

    var skillTypes = {};
    var fdsa = [
      [BonusTypes.INDIVIDUAL_HERO_DAMAGE, { text: "Hero DPS", class: "skill-dps" }],
      [BonusTypes.ALL_DAMAGE_HEROSKILLS, { text: "All Damage", class: "skill-ad" }],
      [BonusTypes.CRIT_DAMAGE_HEROSKILLS, { text: "Crit Damage", class: "skill-cd" }],
      [BonusTypes.TAP_DAMAGE_HEROSKILLS, { text: "Tap Damage", class: "skill-td" }],
      [BonusTypes.TAP_DAMAGE_DPS, { text: "Percent DPS", class: "skill-pd" }],
      [BonusTypes.CHEST_HEROSKILLS, { text: "Chest Gold", class: "skill-cg" }],
      [BonusTypes.GOLD_HEROSKILLS, { text: "Gold Dropped", class: "skill-gd" }],
      [BonusTypes.BOSS_DAMAGE, { text: "Boss Damage", class: "skill-bd" }],
      [BonusTypes.CRIT_CHANCE, { text: "Crit Chance", class: "Skill-cc" }],
    ];
    fdsa.forEach(function(p, i) { skillTypes[p[0]] = p[1]; });

    $scope.getSkillLevel = function(i) {
      return SKILL_LEVELS[$rootScope.world][i-1];
    };

    var setDefaults = function() {
      $scope.refArtifacts = { 1: [], 2: [], };
      for (var i in artifactInfo) {
        var a = artifactInfo[i];
        $scope.refArtifacts[a.world].push({
          name: a.name,
          id: a.id,
          index: i,
          ad0: a.ad0,
          adpl: a.adpl,
          cap: a.levelcap,
          x: a.x.toFixed(1),
          y: a.y.toFixed(1),
          current: 0,
          desired: 0,
          cost: 0,
          cumulative: 0,
          effects: a.effects,
          magnitudes: mapMap(a.effects, function(e) { return { value: 0, text: "", class: ""}; }),
          costFunction: a.cost,
          flavortext: a.flavor
        });
      }

      $scope.refHeroes = [];
      for (var h in heroInfo) {
        var hero = heroInfo[h];
        $scope.refHeroes.push({
          name: hero.name,
          cost: mapMap(hero.baseCost, function(c) { return c.toPrecision(4); }),
          skills: mapMap(hero.skills, function(l) { return l.map(function(s) {
            return {
              magnitude: s[0],
              type: skillTypes[s[1]].text,
              typeclass: skillTypes[s[1]].class,
            };
          }); }),
        });
      }

      $scope.sumCumulative = 0;

      // $scope.r_artifacts = [];
      // $scope.sum_cumulative = 0;

      // for (var i in artifact_info) {
      //   var a = artifact_info[i];
      //   var artifact = {
      //     name: a.name,
      //     index: i,
      //     ad0: a.ad0,
      //     adpl: a.adpl,
      //     cap: isFinite(a.levelcap) ? a.levelcap : null,
      //     x: a.x.toFixed(1),
      //     y: a.y.toFixed(1),
      //     current: 0,
      //     desired: 0,
      //     cost: 0,
      //     cumulative: 0,
      //     magnitude: "",
      //     text: "",
      //     costf: a.cost,
      //     effect: a.effect,
      //     description: a.description
      //     // test: function(l) { return Math.round(a.cost(l)); } // TODO: wtf doesn't this work
      //   };
      //   $scope.r_artifacts.push(artifact);
      // }

      // $scope.r_heroes = [];
      // var skill_types = [
      //   "Hero DPS",
      //   "All damage",
      //   "Crit damage",
      //   "Tap damage",
      //   "Percent DPS",
      //   "Chest Gold",
      //   "Gold Dropped",
      //   "Boss Damage",
      //   "Crit Chance"
      // ];

      // var typeclasses = [
      //   "skill-dps",
      //   "skill-ad",
      //   "skill-cd",
      //   "skill-td",
      //   "skill-pd",
      //   "skill-cg",
      //   "skill-gd",
      //   "skill-bd",
      //   "skill-cc"
      // ];

      // for (var h in hero_info) {
      //   var h = hero_info[h];
      //   var hero = {
      //     name: h.name,
      //     cost: h.base_cost.toPrecision(4),
      //     skills: h.skills.map(function(s) {
      //       return {
      //         magnitude: s[0] * 100 > 1 ? Math.round(s[0] * 100) : s[0] * 100,
      //         type: skill_types[s[1]],
      //         typeclass: typeclasses[s[1]]
      //       };
      //     })
      //   };
      //   $scope.r_heroes.push(hero);
      // }
    };

    var updateMagnitude = function(a) {
      var l = Math.min(a.desired, a.cap == null ? Infinity : a.cap);
      a.magnitudes = [];
      if (l == 0) { return; }

      console.log("-----");
      console.log(a.effects);
      for (etype in a.effects) {
        a.magnitudes.push({
          value: a.effects[etype] * l,
          text: bonusTypeText[etype],
          class: bonusTypeClasses[etype],
        });
      }
      console.log(a.magnitudes);
      // a.magnitudes = mapMap(a.effects, function(etype) {
      //   return {
      //     value: a.effects[etype] * l,
      //     text: bonusTypeText[etype],
      //   };
      // });
    };

    var updateText = function(a) {
      for (var i in a.effects) {
        var e = a.effects[i];
        if (e[0] in bonusCooldowns) {
          a.magnitudes[i].text += " (" + Math.round(30 * ((a.desired * 10) / 100 + 1)).toString() + " s without cooldown)";
        }
      }
    };

    $scope.calcArtifact = function(a) {
      console.log("calc for " + a.name);
      if (a.current != 0) {
        a.cost = Math.ceil(a.costFunction(a.current+1));
        a.cumulative = 0;
        for (var l = a.current; l < a.desired; l++) {
          a.cumulative += Math.ceil(a.costFunction(l+1));
        }
      } else {
        a.cost = 0;
        a.cumulative = 0;
      }
      updateMagnitude(a);
      updateText(a);

      $scope.sumCumulative = $scope.refArtifacts[$rootScope.world].map(function(a) { return a.cumulative; }).reduce(function(a, b) { return a + b; }, 0);
    };

    // var getMagnitude = function(a) {
    //   var l = Math.max(0, Math.min(a.desired, a.cap == null ? Infinity : a.cap));
    //   if (l == 0) {
    //     return "";
    //   }
    //   var s = (l * a.effect).toString() + "% ";
    //   if (a.effect > 0) {
    //     s = "+" + s;
    //   }
    //   return s;
    // };

    // var getText = function(a) {
    //   var s = a.description;
    //   if (s.indexOf("duration") > -1) {
    //     s = s + "(" + Math.round(30 * ((a.desired * 10) / 100 + 1)).toString() + " s without cooldown)";
    //   }
    //   return s;
    // };

    // $scope.calcArtifacts = function(i) {
    //   var a = $scope.r_artifacts[i];
    //   if (a.current != 0) {
    //     a.cost = Math.ceil(a.costf(a.current+1));
    //     a.cumulative = 0;
    //     for (var l = a.current; l < a.desired; l++) {
    //       a.cumulative += Math.ceil(a.costf(l+1));
    //     }
    //   } else {
    //     a.cost = 0;
    //     a.cumulative = 0;
    //   }
    //   a.magnitude = getMagnitude(a);
    //   a.text = getText(a);

    //   $scope.sum_cumulative = $scope.r_artifacts
    //     .map(function(a) { return a.cumulative; })
    //     .reduce(function(a, b) {return a + b; }, 0);
    // };

    $scope.updateFromState = function() {
      var artifactLevels = {};
      for (var w in $rootScope.state.artifacts) {
        for (var i in $rootScope.state.artifacts[w]) {
          var artifact = $rootScope.state.artifacts[w][i];
          // id = level
          artifactLevels[artifact[0]] = artifact[1];
        }
      }

      for (var w in $scope.refArtifacts) {
        for (var i in $scope.refArtifacts[w]) {
          var artifact = $scope.refArtifacts[w][i];
          artifact.current = artifactLevels[artifact.id];
          artifact.desired = artifactLevels[artifact.id];
          $scope.calcArtifact(artifact);
        }
      }

      // var a = artifacts[i];
      //   $scope.r_artifacts[a.index].current = a.value;
      //   $scope.r_artifacts[a.index].desired = a.value;
      // }
      // for (var i in $scope.r_artifacts) {
      //   $scope.calcArtifacts(i);

      // for (var i in artifactInfo) {
      //   var a = artifactInfo[i];
      //   $scope.refArtifacts[a.world].push({
      //     name: a.name,
      //     id: a.id,
      //     index: i,
      //     ad0: a.ad0,
      //     adpl: a.adpl,
      //     cap: a.levelcap,
      //     x: a.x.toFixed(1),
      //     y: a.y.toFixed(1),
      //     current: 0,
      //     desired: 0,
      //     cost: 0,
      //     cumulative: 0,
      //     effects: a.effects,
      //     magnitudes: a.effects.map(function(e) { return { value: 0, text: ""}; }),
      //     costFunction: a.cost,
      //     flavortext: a.flavor
      //   });
      // }



      // $scope.artifacts = {
      //     1: $rootScope.state.artifacts[1].map(function(p) {
      //       return {
      //         name: artifactMapping[p[0]].name,
      //         id: p[0],
      //         level: p[1],
      //       };}),
      //     2: $rootScope.state.artifacts[2].map(function(p) {
      //       return {
      //         name: artifactMapping[p[0]].name,
      //         id: p[0],
      //         level: p[1],
      //       };}),
      //   };



      // var t = $rootScope.state.split("|");

      // var artifacts = [];
      // t[1].split(",").forEach(function(a, i, array) {
      //   var v = a.split(".");
      //   var aindex = parseOrZero(v[0], parseInt);
      //   var avalue = parseOrZero(v[1], parseInt);
      //   artifacts.push({
      //     name: artifact_info[aindex].name,
      //     index: aindex,
      //     value: avalue
      //   });
      // });

      // for (var i in artifacts) {
      //   var a = artifacts[i];
      //   $scope.r_artifacts[a.index].current = a.value;
      //   $scope.r_artifacts[a.index].desired = a.value;
      // }
      // for (var i in $scope.r_artifacts) {
      //   $scope.calcArtifacts(i);
      // }
    };

    $scope.$on('stateUpdate', function() {
      $scope.updateFromState();
    });

    setDefaults();
    $scope.updateFromState();
  }
);