yattoApp.controller('OtherCalcController',
  function($scope, $rootScope) {
    var verbose = true;
    var log = function(s) {
      if (verbose) {
        console.log("[MainController] " + s);
      }
    };

    log("start of file");

    var setDefaults = function() {
      $scope.artifacts = {1: [], 2: []};
      $scope.artifactCaps = {};

      for (var ak in artifactInfo) {
        var a = artifactInfo[ak];
        $scope.artifacts[a.world].push({
          name: a.name,
          id: a.id,
          level: 0
        });
        $scope.artifactCaps[a.id] = a.levelcap;
      }

      $scope.heroes = [];
      heroInfo.forEach(function(h, i) {
        $scope.heroes.push({
          name: h.name,
          id: h.id,
          weapons: 0,
          level: {
            1: 0,
            2: 0,
          },
          best: {
            1: 0,
            2: 0,
          },
        });
      });

      $scope.allCustomizations = cBonus.map(function(c) { return []; });
      $scope.customizationTotals = cBonus.map(function(c) { return 0; });
      $scope.ownedCustomizations = [];

      $scope.customizationLabels = [
        "Swords",
        "Scarves",
        "Hats",
        "Auras",
        "Armor",
        "Trails"
      ];

      $scope.customizationClass = [
        "skill-td",
        "skill-dps",
        "skill-gd",
        "skill-ad",
        "skill-cc",
      ];

      $scope.customizations = [];
      cBonus.forEach(function(c, i) {
        $scope.customizations.push({
          name: cNames[i],
          index: i,
          value: 0,
          step: (i == 4 ? 0.5 : 1), // ehhhhhhhhh
          max: customizationMax[i]
        });
      });

      customizationInfo.forEach(function(c, i) {
        var ce = c.value / c.cost;
        $scope.allCustomizations[c.type].push({
          label: c.label,
          name: c.name,
          value: c.value,
          cost: c.cost,
          ctype: c.ctype,
          type: c.type,
          coste: isNaN(ce) ? 0 : ce,
          owned: false,
          class: $scope.customizationClass[c.ctype],
        });
      });
      // $scope.oc_customizations = [[], [], [], [], [], []];
      // $scope.oc_customization_totals = [0, 0, 0, 0, 0, 0];
      // customization_info.forEach(function(c, i) {
      //   var ce = c.value / c.cost;
      //   $scope.oc_customizations[cMapping[c.label[0]]].push({
      //     name: c.name,
      //     value: c.value,
      //     cost: c.cost,
      //     ctype: c.ctype,
      //     type: c.type,
      //     coste: isNaN(ce) ? 0 : ce,
      //     owned: c.ctype != CTYPE_D
      //   });
      // });

      $scope.critss = 0;
      $scope.zerker = 0;
      $scope.memory = 0;

      $scope.diamonds = 0;
      $scope.customizationsToBuy = [];

      $scope.mantissa = 5;
      $scope.exponent = 200;

      $scope.totalLevels = 0;
      $scope.targetLevels = 0;
      $scope.targetStage = 0;
    };

    $scope.getCHeading = function(i) {
      return $scope.customizationLabels[i] + " (" + cNames[i] + ")";
    };

    $scope.buyCustomization = function(c, index) {
      $scope.allCustomizations[c.type].forEach(function(cu, i) {
        if (cu.name == c.name) {
          cu.owned = true;
        }
      });
      $scope.customizations[c.type].value += c.value;
      $scope.customizationsToBuy.splice(index, 1);
    };

    // TODO: refactor away
    var transformScopeArray = function(scopeArray) {
      var newArray = newZeroes(scopeArray.length);
      for (var x in scopeArray) {
        var thing = scopeArray[x];
        newArray[thing.index] = parseFloat(thing.value);
      }
      return newArray;
    };

    var getArtifacts = function() {
      return $scope.artifacts[$rootScope.world].map(function(a) {
        return [a.id, parseInt(a.level)];
      });
    };

    var getWeapons = function() {
      return transformScopeArray($scope.heroes.map(function (h) {
        return {index: h.id - 1, value: h.weapons}; }));
    };

    var getLevels = function() {
      return transformScopeArray($scope.heroes.map(function (h) {
        return {index: h.id - 1, value: h.level[$rootScope.world]}; }));
    };

    // var getGameState = function(c) {
    //   return new GameState(
    //     transformScopeArray($scope.artifacts),
    //     getWeapons(),
    //     getLevels(),
    //     c,
    //     { cs: $scope.critss, br: $scope.zerker });
    // };

    var getGameState = function(c) {
      return new GameState({
        world: 1,
        artifacts: getArtifacts(),
        levels: getLevels(),
        weapons: getWeapons(),
        customizations: c,
        skillLevelCrit: $scope.critss,
        skillLevelTDMG: $scope.zerker,
        memory: $scope.memory
      });
    };

    var getDmgE = function(c) {
      var g = getGameState(c);
      return { gold: g.getGoldMultiplier(), tdmg: g.getTapDamage()[1] };
    };

    $scope.updateTotals = function() {
      cBonus.forEach(function(c, i) {
        $scope.customizations[i].value = 0;
      });
      for (var type in $scope.allCustomizations) {
        $scope.allCustomizations[type].forEach(function(c, i) {
          if (c.owned) {
            $scope.customizations[c.type].value += c.value;
          }
        });
      }
    };

    $scope.recalcCList = function() {
      log("recalculating customization list");
      $scope.diamonds = 0;
      $scope.customizationsToBuy = [];
      $scope.customizationTotals = cBonus.map(function(c) { return 0; });

      var tempC = cBonus.map(function(c) { return []; });
      for (var type in $scope.allCustomizations) {
        $scope.allCustomizations[type].forEach(function(c, i) {
          if (!c.owned && c.ctype == CTYPE_D) {
            tempC[type].push(c);
            $scope.diamonds += c.cost;
          }
          if (c.owned) {
            $scope.customizationTotals[c.type] += c.value;
          }
        });
      }

      tempC = tempC.filter(function(l) { return l.length != 0 });

      // sort each type by raw cost efficiency
      for (var type in tempC) {
        tempC[type] = tempC[type].sort(function(c1, c2) {
          return c2.coste - c1.coste;
        });
      }

      // index-0s are now a "min-heap"
      var tempTotals = $scope.customizationTotals.slice();
      while (tempC.length > 1) {
        // console.log("temp totals: ", tempTotals);
        var baseValue = getDmgE(tempTotals);
        // console.log("baseValue: ", baseValue);
        var max = 0;
        var maxi = -1;
        // compare options
        for (t in tempC) {
          var c = tempC[t][0];
          var newTotals = tempTotals.slice();
          newTotals[c.type] += c.value;

          // console.log("new totals: ", newTotals);

          var newValue = getDmgE(newTotals);
          // console.log("newValue: ", newValue);

          var goldRatio = newValue.gold / baseValue.gold;
          var tdmgRatio = newValue.tdmg / baseValue.tdmg;

          var goldDmgEquivalent = Math.pow(1.044685, Math.log(goldRatio) / Math.log(1.075));
          var tdmgEquivalentRatio = goldDmgEquivalent * tdmgRatio;
          var tdmgEquivalent = baseValue.tdmg * tdmgEquivalentRatio;

          var efficiency = (tdmgEquivalent - baseValue.tdmg) / c.cost;
          // console.log("----------------");
          // console.log(efficiency);
          // console.log(max);
          if (efficiency > max) {
            max = efficiency;
            maxi = t;
          }
        }
        if (maxi == -1) {
          console.log("alskjdfljasdljfaskldf");
        }
        var bestC = tempC[maxi].shift();
        // remove type list if empty
        if (tempC[maxi].length == 0) {
          tempC.splice(maxi, 1);
        }
        tempTotals[bestC.type] += bestC.value;
        $scope.customizationsToBuy.push(bestC);
      }

      // $scope.diamonds = 0;
      // $scope.unowned_customizations = [];
      // $scope.oc_customization_totals = [0, 0, 0, 0, 0, 0];

      // var tc = [[], [], [], [], [], []];
      // for (var type in $scope.oc_customizations) {
      //   $scope.oc_customizations[type].forEach(function(c, i) {
      //     if (!c.owned && c.ctype == CTYPE_D) {
      //       tc[type].push(c);
      //       $scope.diamonds += c.cost;
      //     }
      //     if (c.owned) {
      //       $scope.oc_customization_totals[c.type] += c.value / 100;
      //     }
      //   });
      // }

      // tc = tc.filter(function(n){ return n.length != 0 });

      // // sort unowned by efficiency
      // for (var type in tc) {
      //   tc[type] = tc[type].sort(function(c1, c2) {
      //     return c2.coste - c1.coste;
      //   });
      // }

      // var temp_totals = $scope.oc_customization_totals.slice(0);
      // while (tc.length > 1) {
      //   var base = getDmgE(temp_totals);
      //   var max = 0;
      //   var maxi = -1;
      //   for (t in tc) {
      //     var c = tc[t][0];
      //     var new_totals = temp_totals.slice(0);
      //     new_totals[c.type] += c.value / 100;
      //     var new_value = getDmgE(new_totals);

      //     var gold_ratio = new_value[0] / base[0];
      //     var tdmg_ratio = new_value[1] / base[1];
      //     var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_ratio) / Math.log(1.075));
      //     var eq_tdmg = (gold_dmg_equivalent - 1) * base[1] + new_value[1];
      //     var eff = (eq_tdmg - base[1]) / c.cost;
      //     if (eff > max) {
      //       max = eff;
      //       maxi = t;
      //     }
      //   }
      //   if (maxi == -1) {
      //     console.log("alskdjfljasldjjaaaaaaA");
      //     console.log(tc);
      //   }
      //   var bestc = tc[maxi].shift();
      //   if (tc[maxi].length == 0) {
      //     tc.splice(maxi, 1);
      //   }
      //   temp_totals[bestc.type] += bestc.value / 100;
      //   $scope.unowned_customizations.push(bestc);
      // }

      // var base = getDmgE($scope.oc_customization_totals);
      // console.log("base: " + base);
      // for (i in $scope.unowned_customizations) {
      //  console.log("--------------------------------");
      //  var c = $scope.unowned_customizations[i];
      //  var new_totals = $scope.oc_customization_totals.slice(0);
      //  new_totals[c.type] += c.value / 100;
      //  console.log(new_totals);
      //  var new_value = getDmgE(new_totals);

      //  var gold_ratio = new_value[0] / base[0];
      //  var tdmg_ratio = new_value[1] / base[1];
      //  var gold_dmg_equivalent = Math.pow(1.044685, Math.log(gold_ratio) / Math.log(1.075));
      //  var eq_tdmg = (gold_dmg_equivalent - 1) * base[1] + new_value[1];
      //  c.efficiency = (eq_tdmg - base[1]) / c.cost;

      //  console.log(c.name + ":");
      //  console.log("   " + c.cost);
      //  console.log("   " + c.efficiency);
      // }
      // $scope.unowned_customizations = $scope.unowned_customizations.sort(function(c1, c2) {
      //  c1.efficiency - c2.efficiency;
      // });
    };

    $scope.setAll = function() {
      var l = parseOrZero($scope.setLevel, parseInt);
      if (isNonNull(l) && l != 0) {
        $scope.heroes.forEach(function(h, i) {
          h.level[$rootScope.world] = l;
        });
        // $scope.oc_heroes.forEach(function(h, i) {
        //   h.level = l;
        // });
      }
      $scope.updateLevels();
    };

    $scope.updateLevels = function() {
      $scope.totalCurrent = $scope.heroes.map(function(h) { return h.level[$rootScope.world]; }).reduce(function(a, b) { return a + b; }, 0);
    };

    $scope.recalcBest = function() {
      // TODO: optimize this

      var gold = $scope.mantissa * Math.pow(10, $scope.exponent);
      var levels = getLevels();

      var goldLeft = gold;
      var levelsNew = levels.slice();

      [1000, 100, 10].forEach(function(interval, i) {
        var onePercent = goldLeft / 100;
        heroInfo.forEach(function(h, i) {
          var l = levelsNew[i];
          var cost = h.costToLevel($rootScope.world, l, l + interval);
          while (cost < onePercent) {
            l += interval;
            goldLeft -= cost;
            cost = h.costToLevel($rootScope.world, l, l + interval);
          }
          levelsNew[i] = l;
        });
      });

      // coarse done, go one by one
      var lheap = binaryHeap(function(a, b) {
        return a[0] < b[0];
      });

      heroInfo.forEach(function(h, i) {
        var l = levelsNew[i];
        var cost = h.getUpgradeCost($rootScope.world, l);
        lheap.push([cost, i]);
      });

      var steps = 0;
      while (goldLeft > 0) {
        steps += 1;
        var t = lheap.pop();
        var cost = t[0];
        var index = t[1];
        if (goldLeft > cost) {
          goldLeft -= cost;
          levelsNew[index] += 1;
          var newCost = heroInfo[index].getUpgradeCost($rootScope.world, levelsNew[index]);
          lheap.push([newCost, index]);
        } else {
          break;
        }
      }

      $scope.heroes.forEach(function(h, i) {
        h.best[$rootScope.world] = levelsNew[i];
      });
      $scope.totalLevels = levelsNew.reduce(function(a, b) { return a + b; });

      var current = $scope.totalLevels;
      var requiredGold = 0;
      while (current < $scope.targetLevels) {
        var t = lheap.pop();
        var cost = t[0];
        var index = t[1];
        requiredGold += cost;
        current += 1;
        levelsNew[index] += 1;
        var newCost = heroInfo[index].getUpgradeCost($rootScope.world, levelsNew[index]);
        lheap.push([newCost, index]);
      }

      $scope.targetGold = parseFloat(requiredGold.toPrecision(4)).toExponential()
      var g = getGameState($scope.customizationTotals);
      console.log(g.getGoldMultiplier());
      console.log(baseStageGold($scope.targetStage));
      var goldPerMob = g.getGoldMultiplier() * baseStageGold($scope.targetStage);
      $scope.targetMonsters = parseFloat(Math.round(requiredGold / goldPerMob).toPrecision(4)).toExponential();

      // var gold_left = gold;
      // var gold100 = gold / 100;
      // var levels_new = levels.slice();

      // // console.log(levels_new);

      // hero_info.forEach(function(h, i) {
      //   var l = levels_new[i];
      //   var cost = h.cost_to_level(l, l + 100);
      //   while (cost < gold100) {
      //     l += 100;
      //     gold_left -= cost;
      //     cost = h.cost_to_level(l, l + 100);
      //   }
      //   levels_new[i] = l;
      // });

      // // console.log(gold_left);
      // // console.log(levels_new);

      // var gold10 = gold_left / 100;
      // hero_info.forEach(function(h, i) {
      //   var l = levels_new[i];
      //   var cost = h.cost_to_level(l, l + 10);
      //   while (cost < gold10) {
      //     l += 10;
      //     gold_left -= cost;
      //     cost = h.cost_to_level(l, l + 10);
      //   }
      //   levels_new[i] = l;
      // });

      // // console.log(gold_left);
      // // console.log(levels_new);

      // var lheap = binaryHeap(function(a, b) {
      //   return a[0] < b[0];
      // });

      // hero_info.forEach(function(h, i) {
      //   var l = levels_new[i];
      //   var cost = h.get_upgrade_cost(l);
      //   lheap.push([cost, i]);
      // });

      // var steps = 0;
      // while (gold_left > 0) {
      //   steps += 1;
      //   var t = lheap.pop();
      //   var cost = t[0];
      //   var index = t[1];
      //   if (gold_left > cost) {
      //     gold_left -= cost;
      //     levels_new[index] += 1;
      //     var new_cost = hero_info[index].get_upgrade_cost(levels_new[index]);
      //     lheap.push([new_cost, index]);
      //   } else {
      //     break;
      //   }
      // }

      // $scope.oc_heroes.forEach(function(h, i) {
      //   h.best = levels_new[i];
      // });

      // $scope.total_levels = levels_new.reduce(function(a, b) { return a + b; });

      // var current = $scope.total_levels;
      // var required_gold = 0;
      // while (current < $scope.target_levels) {
      //   var t = lheap.pop();
      //   var cost = t[0];
      //   var index = t[1];
      //   required_gold += cost;
      //   current += 1;
      //   levels_new[index] += 1;
      //   var new_cost = hero_info[index].get_upgrade_cost(levels_new[index]);
      //   lheap.push([new_cost, index]);
      // }
      // console.log(required_gold);
      // $scope.target_gold = parseFloat(required_gold.toPrecision(4)).toExponential();

      // base_stage_gold($scope.target_stage)

      // var g = getGameState($scope.oc_customization_totals);
      // g.get_all_skills();

      // var gold_per_mob = g.mob_multiplier() * base_stage_gold($scope.target_stage);
      // $scope.target_monsters = parseFloat(Math.round(required_gold / gold_per_mob).toPrecision(4)).toExponential();

      // console.log(gold_left);
      // console.log(levels_new);
      // console.log(levels_new.reduce(function(a, b) { return a + b; }));
      // console.log(steps);
    };

    $scope.stateChanged = function() {
      log("state changed");
      $scope.updateTotals();
      $scope.customizationsToBuy = [];

      var newStateObject = {
        customizations: $scope.customizations.map(function(c) { return c.value; }),
        ownedCustomizations: [].concat.apply([], $scope.allCustomizations)
                              .filter(function(c) { return c.owned; })
                              .map(function(c) { return c.label; }),
      };

      $scope.updateLevels();

      console.log("newStateObject: ", newStateObject);
      // this broadcasts a stateUpdate, which calls updateThings
      $scope.$parent.loadFromState(newStateObject);
    };

    $scope.updateFromState = function(updateCookies) {
      log("updateFromState");
      try {
        $scope.artifacts = {
          1: $rootScope.state.artifacts[1].map(function(p) {
            return {
              name: artifactMapping[p[0]].name,
              id: p[0],
              level: p[1],
            };}),
          2: $rootScope.state.artifacts[2].map(function(p) {
            return {
              name: artifactMapping[p[0]].name,
              id: p[0],
              level: p[1],
            };}),
        };

        $rootScope.state.weapons.forEach(function(w, i) {
          $scope.heroes[i].weapons = w;
        });

        $scope.heroes.forEach(function(h, i) {
          $scope.heroes[i].level = {
            1: $rootScope.state.levels[1][i],
            2: $rootScope.state.levels[2][i],
          };
        });

        $rootScope.state.customizations.forEach(function(c, i) {
          $scope.customizations[i].value = c;
        });

        // console.log($rootScope.state.ownedCustomizations);
        $rootScope.state.ownedCustomizations.forEach(function(cl, i) {
          for (var type in $scope.allCustomizations) {
            $scope.allCustomizations[type].forEach(function(c, i) {
              if (c.label == cl) {
                c.owned = true;
              }
            });
          }
        });

        $scope.critss   = $rootScope.state.levelCrit;
        $scope.zerker   = $rootScope.state.levelTDMG;
        $scope.memory   = $rootScope.state.memory;

        $scope.totalCurrent = $scope.heroes.map(function(h) { return h.level[$rootScope.world]; }).reduce(function(a, b) { return a + b; }, 0);

        // if ($scope.r_undead == 0) { $scope.r_undead = undead; }
        // if ($scope.r_levels == 0) { $scope.r_levels = getLevels().reduce(function(a, b) { return a + b; }); }

        console.log("updateFromState update things");
        $scope.$parent.saveStateToCookies();
      } catch (err) {
        log("update from state error: " + err);
        setDefaults();
      }
    };

    $scope.$on('stateUpdate', function() {
      log("broadcasted state update");
      $scope.updateFromState(true);
    });

    $scope.$on('worldUpdate', function() {
      $scope.updateLevels();
    });

    setDefaults();
    $scope.updateFromState(false);

    log("end of other calc");
  }
);