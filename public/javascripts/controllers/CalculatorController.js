yattoApp.controller('CalculatorController',
  function($scope, $http, $cookies, $cookieStore, $timeout, $rootScope, $routeParams, localStorageService, usSpinnerService) {
    MathJax.Hub.Configured();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

    var verbose = true;
    var log = function(s) {
      if (verbose) {
        console.log("[CalculatorController] " + s);
      }
    };

    log("start of file");

    // options for sorting artifacts
    $scope.sortableOptions = {
      'ui-floating': false,
      'axis': 'y',
      'containment': "parent",
      'handle': '> .myHandle',
      update: function(e, ui) {
        // TODO: a bit hacky, but seems like the update event is being fired before change to $artifacts is applied?
        $timeout(function() {
          $scope.stateChanged(1);
        }, 10);
      }
    };

    $scope.spinneractive = false;
    $rootScope.$on('us-spinner:spin', function(event, key) {
        $scope.spinneractive = true;
      });

      $rootScope.$on('us-spinner:stop', function(event, key) {
        $scope.spinneractive = false;
      });

    $scope.steps = [];
    $scope.summary_steps = [];
    $scope.stepmessage = "Click calculate to get steps!";

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

      log("artifact defaults: ", $scope.artifacts);
      log("artifact caps: ", $scope.artifactCaps);

      $scope.heroes = [];
      heroInfo.forEach(function(h, i) {
        $scope.heroes.push({
          name: h.name,
          id: h.id,
          weapons: 0,
          level: {
            1: 0,
            2: 0
          },
        });
      });

      log("hero defaults: ", $scope.heroes);


      // $scope.artifact_caps = artifact_info.map(function(a) { return a.levelcap == Infinity ? null : a.levelcap; });
      // $scope.artifacts = [];
      // for (var a in artifact_info) {
      //   $scope.artifacts.push({
      //     name: artifact_info[a].name,
      //     index: a,
      //     value: 0
      //   });
      // }

      // $scope.heroes = [];
      // for (var h in hero_info) {
      //   $scope.heroes.push({
      //     name: hero_info[h].name,
      //     index: h,
      //     weapons: 0,
      //     level: 800
      //   });
      // }

      $scope.customizations = [];
      cBonus.forEach(function(c, i) {
        $scope.customizations.push({
          name: cNames[i],
          index: i,
          value: 0,
          step: (i == 4 ? 0.5 : 1),
          max: customizationMax[i]
        });
      });

      log("customization defaults: ", $scope.customizations);

      // $scope.customizations = [
      //   {name: "All Damage",      index: 0, value: 0, step: 1,   max: 154},
      //   {name: "Critical Damage", index: 1, value: 0, step: 1,   max: 91},
      //   {name: "Gold Dropped",    index: 2, value: 0, step: 1,   max: 86},
      //   {name: "Chest Gold",      index: 3, value: 0, step: 1,   max: 177},
      //   {name: "Critical Hit",    index: 4, value: 0, step: 0.5, max: 14.5},
      //   {name: "Tap Damage",      index: 5, value: 0, step: 1,   max: 44}];

      $scope.methods = [
        {name: "All Damage",        index: 0, value: true, tabname: "ADmg"},
        {name: "Gold",              index: 1, value: true, tabname: "Gold"},
        {name: "Tap Damage",        index: 2, value: true, tabname: "TDmg"},
        {name: "Dmg Equivalent",    index: 3, value: true, tabname: "DmgE"}];
        // {name: "Relics/second",     index: 4, value: false, tabname: " R/s "},
        // {name: "Stages/second",     index: 5, value: false, tabname: " S/s "}];

      $scope.methods[0]["tooltip"] = "Calculates all damage value";
      $scope.methods[1]["tooltip"] = "Calculates gold multiplier";
      $scope.methods[2]["tooltip"] = "Calculates tap damage with crits";
      $scope.methods[3]["tooltip"] = "Calculates mix of gold and tap damage";
      // $scope.methods[4]["tooltip"] = "Calculates relics per second";
      // $scope.methods[5]["tooltip"] = "Calculates stages per second blah blah this is going to be a long ass explanation because I'll need to explain stages and tie breaking";

      $scope.tabs = [
        true,
        false,
        false,
        false,
        // false,
        // false
      ];
      $scope.activetab = 0;

      $scope.relics = 0;
      $scope.nsteps = 0;
      $scope.greedy = 1;
      $scope.active = false;
      $scope.critss = 0;
      $scope.zerker = 0;

      $scope.maxStageSPM = 0;
      $scope.memory = 0;

      $scope.w_chiprob = 0;
      $scope.w_totalwp = 0;
      $scope.w_tonexts = 0;
      $scope.w_getting = 0;
      $scope.w_probset = 0;

      $scope.r_cstage = 0;
      $scope.r_undead = 0;
      $scope.r_levels = 0;
      $scope.r_hbonus = 0;
      $scope.r_sbonus = 0;
      $scope.r_reward = 0;
      $scope.r_nextbp = 0;
      $scope.r_atnext = 0;

      $scope.all_damage = 0;
      $scope.dps_damage = 0;
      $scope.tap_damage = 0;
      $scope.twc_damage = 0;
    };

    var transformScopeArray = function(scopeArray) {
      var newArray = newZeroes(scopeArray.length);
      for (var x in scopeArray) {
        var thing = scopeArray[x];
        newArray[thing.index] = parseFloat(thing.value);
      }
      return newArray;
    };

    // var factorials = {};
    // var f = 1;
    // factorials[0] = 1;
    // factorials[1] = 1;
    // for (var i = 2; i < 100; i++) {
    //   f *= i;
    //   factorials[i] = f;
    // }

    // var factorial = function(n) {
    //   return factorials[n];
    // };

    // var choose = function(a, b) {
    //   if (b > a) {
    //     return 0;
    //   }
    //   return factorial(a) / (factorial(b) * factorial(a-b));
    // };

    $scope.filterArtifacts = function (a) {
      return a.world == $rootScope.world;
    };

    var getArtifacts = function() {
      return $scope.artifacts[$rootScope.world].map(function(a) {
        return [a.id, parseInt(a.level)];
      });

      // var allArtifacts = [];

      // console.log($scope.artifacts);
      // console.log([].concat.apply([], $scope.artifacts));


      // return [].concat.apply([], $scope.artifacts).map(function(a) {
      //   return [a.index, parseInt(a.level)];
      // });
      // return $scope.artifacts.map(function(a) {
      //   return [a.index, parseInt(a.level)];
      // });
    };

    var getWeapons = function() {
      return transformScopeArray($scope.heroes.map(function (h) {
        return {index: h.id - 1, value: h.weapons}; }));
    };

    var getLevels = function() {
      return transformScopeArray($scope.heroes.map(function (h) {
        return {index: h.id - 1, value: h.level[$rootScope.world]}; }));
    };

    var getCustomizations = function() {
      return transformScopeArray($scope.customizations);
    }

    $scope.setActiveTab = function() {
      if ($scope.steps.length > 0) {
        for (var m in $scope.methods) {
          var i = $scope.methods[m].index;
          if (i in $scope.steps && $scope.steps[i] != null) {
            $scope.tabs[i] = true;
            $scope.activetab = i;
            break;
          } else {
            $scope.tabs[i] = false;
          }
        }
      }
    };

    $scope.readFromCookies = function() {
      log("read from cookies");
      var cookie_steps = localStorageService.get('steps');
      var cookie_summs = localStorageService.get('summs');

      if (isNonNull(cookie_steps)) { $scope.steps = cookie_steps; }
      if (isNonNull(cookie_summs)) { $scope.summary_steps = cookie_summs; }

      $scope.setActiveTab();
    };

    $scope.storeToCookies = function() {
      // log("store to cookies");
      localStorageService.set('steps', $scope.steps);
      localStorageService.set('summs', $scope.summary_steps);
    };

    $scope.updateCookies = function() {
      // log("update cookies");
      if ($rootScope.aCookies == 'On') {
        $scope.$parent.saveS();
        $scope.storeToCookies();
      }
      localStorageService.set('autoc', $rootScope.aCookies);
    };

    $scope.clearAllCookies = function() {
      log("clear all cookies");
      localStorageService.clearAll();
    };

    $scope.updateRelicInfo = function() {
      // log("update relic info");
      var uaMultiplier = 1 + 0.05 * $scope.r_undead;
      var heroRelics = $scope.r_levels / 1000;
      var stageRelics = Math.pow(Math.floor($scope.r_cstage/15) - 5, 1.7);

      heroRelics = Math.round(heroRelics * uaMultiplier);

      stageRelics = Math.ceil(stageRelics * uaMultiplier);
      stageRelics = isNaN(stageRelics) ? 0 : stageRelics;

      $scope.r_hbonus = heroRelics;
      $scope.r_sbonus = stageRelics;

      $scope.r_nextbp = (Math.floor($scope.r_cstage / 15) + 1) * 15;
      $scope.r_reward = Math.round(2 * (stageRelics + heroRelics));

      stageRelics = Math.pow(Math.floor($scope.r_nextbp/15) - 5, 1.7);
      stageRelics = Math.ceil(stageRelics * uaMultiplier);
      stageRelics = isNaN(stageRelics) ? 0 : stageRelics;
      $scope.r_atnext = Math.round(2 * (stageRelics + heroRelics));
    };

    // $scope.updateWeaponInfo = function() {
    //   var weapons = getWeapons();
    //   $scope.w_totalwp = weapons.reduce(function(a, b) { return a + b; });
    //   $scope.w_chiprob = Math.round(calculate_weapons_probability(weapons) * 100000) / 100000;

    //   var min = weapons[0];
    //   var toNextSet = 1;
    //   for (var i = 1; i < weapons.length; i++) {
    //     if (weapons[i] == min) {
    //       toNextSet += 1;
    //     } else if (weapons[i] < min) {
    //       toNextSet = 1;
    //       min = weapons[i];
    //     }
    //   }
    //   $scope.w_tonexts = toNextSet;
    //   var getting = $scope.w_getting;
    //   if (getting < toNextSet) {
    //     $scope.w_probset = 0;
    //   } else {
    //     // https://www.reddit.com/r/TapTitans/comments/33smgn/probability_of_completing_a_full_weapon_set_on/
    //     // p = [Sum_{i=0}^{i=w} (-1)^i * C(33-w,i) * (33-i)^n ] / 33^n
    //     var summation = 0;
    //     var w = 33 - toNextSet;
    //     for (var i = 0; i <= w; i++) {
    //       summation += Math.pow(-1, i) * choose(toNextSet, i) * Math.pow(33-i, getting);
    //     }
    //     var p = summation / Math.pow(33, getting);
    //     $scope.w_probset = Math.round(p * 100000) / 100000;
    //   }
    // };

    $scope.updateStatsInfo = function() {
      // log("update stats info");
      var weapons = getWeapons();
      $scope.w_totalwp = weapons.reduce(function(a, b) { return a + b; });
      var g = getGameState();
      var tap = g.getTapDamage();
      $scope.all_damage = g.getAllDamage();
      $scope.dps_damage = parseFloat(g.getTotalHeroDPS().toPrecision(4)).toExponential();
      $scope.tap_damage = parseFloat(tap[0].toPrecision(4)).toExponential();
      $scope.twc_damage = parseFloat(tap[1].toPrecision(4)).toExponential();
      $scope.twa_damage = parseFloat(tap[2].toPrecision(4)).toExponential();
    };

    $scope.updateThings = function() {
      log("update things");
      $scope.url = "http://yatto.me/#/calculator?state=" + LZString.compressToEncodedURIComponent($rootScope.state);

      $scope.updateCookies();

      // recalculate things
      $scope.updateRelicInfo();
      // $scope.updateWeaponInfo();
      $scope.updateStatsInfo();
    };

    $scope.stateChanged = function(i) {
      log("state changed");
      var newValue = "";
      if (i == 1)       { }// newValue = $scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join(); }
      else if (i == 2)  { newValue = $scope.heroes.map(function(h) { return h.weapons; }).join(); }
      else if (i == 3)  { newValue = $scope.heroes.map(function(h) { return h.level; }).join(); }
      else if (i == 4)  { newValue = $scope.customizations.map(function(c) { return c.value; }).join(); }
      else if (i == 5)  { newValue = $scope.methods.map(function(m) { return m.value ? 1 : 0; }).join(); }
      else if (i == 6)  { newValue = $scope.relics; }
      else if (i == 7)  { newValue = $scope.nsteps; }
      else if (i == 8)  { newValue = $scope.greedy; }
      else if (i == 9)  { newValue = $scope.w_getting; }
      else if (i == 10) { newValue = $scope.r_cstage; }
      else if (i == 11) { newValue = $scope.r_undead; }
      else if (i == 12) { newValue = $scope.r_levels; }
      else if (i == 13) { newValue = $scope.active; }
      else if (i == 14) { newValue = $scope.critss; }
      else if (i == 15) { newValue = $scope.zerker; }
      else if (i == 16) { newValue = $scope.a_currentSeed; }
      else if (i == 17) { newValue = $scope.a_aPriorities; }
      else if (i == 18) { newValue = $scope.a_maxDiamonds; }
      else if (i == 19) { newValue = $scope.w_currentSeed; }
      else if (i == 20) { newValue = $scope.w_toCalculate; }
      else if (i == 21) { newValue = $scope.memory; }

      $scope.$parent.updateSS(i, newValue);
      $scope.updateThings();
    };

    var getGameState = function() {
      log("getGameState");

      return new GameState({
        world: $rootScope.world,
        artifacts: getArtifacts(),
        levels: getLevels(),
        weapons: getWeapons(),
        customizations: getCustomizations(),
        skillLevelCrit: $scope.critss,
        skillLevelTDMG: $scope.zerker,
        memory: $scope.memory
      });
        // transformScopeArray($scope.artifacts),
        // getWeapons(),
        // getLevels(),
        // transformScopeArray($scope.customizations),
        // { cs: $scope.critss, br: $scope.zerker, memory: $scope.memory });
    };

    // validation of values
    $scope.artifactCheck = function(a) {
      var ai = a.id;
      if ($scope.artifactCaps[ai] != null && a.level > $scope.artifactCaps[ai]) {
        a.level = $scope.artifactCaps[ai];
      }
      if (a.level == null) {
        a.level = 0;
      }
      if (ai == artifactInfo.UA.id) {
        $scope.r_undead = a.level;
      }

      // if ($scope.artifactCaps[ai] != null &&
      //     $scope.artifacts[i].level > $scope.artifactCaps[ai]) {
      //   $scope.artifacts[i].level = $scope.artifactCaps[ai];
      // }
      // if ($scope.artifacts[i].level == null) {
      //   $scope.artifacts[i].level = 0;
      // }
      // if (ai == artifactInfo.UA.id) {
      //   $scope.r_undead = $scope.artifacts[i].level;
      // }
      $scope.stateChanged(1);
    };

    $scope.weaponsCheck = function(i, ai) {
      if ($scope.heroes[i].weapons == null) {
        $scope.heroes[i].weapons = 0;
      }
      $scope.stateChanged(2);
    };

    $scope.levelsCheck = function(i, ai) {
      if ($scope.heroes[i].level == null) {
        $scope.heroes[i].level = 0;
      }
      $scope.r_levels = getLevels().reduce(function(a, b) { return a + b; });
      $scope.stateChanged(3);
    };

    $scope.customizationCheck = function(i, ai) {
      if ($scope.customizations[i].value == null) {
        $scope.customizations[i].value = 0;
      }
      $scope.stateChanged(4);
    };

    var sortByArtifactOrder = function(s) {
      var indexToSStep = {};
      for (var ss in s) {
        indexToSStep[s[ss].id] = s[ss];
      }
      var newSS = [];
      var aOrder = $scope.artifacts[$rootScope.world].map(function(a) { return a.id; });
      // console.log(aOrder);
      for (var i in aOrder) {
        if (aOrder[i] in indexToSStep) {
          newSS.push(indexToSStep[aOrder[i]]);
        }
      }
      return newSS;
    };

    $scope.calculate = function() {
      if ($scope.relics == 0 && $scope.nsteps == 0) {
        $scope.stepmessage = "Get some relics or enter a number of steps!";
        $scope.steps = [];
        $scope.summary_steps = [];
        return;
      }

      // TODO: if no artifacts, buy new artifact (put in calculate.js?)

      // var artifacts = transformScopeArray($scope.artifacts);
      // if (sumArray(artifacts) == 0) {
      //   $scope.stepmessage = "Buy a new artifact!";
      //   $scope.steps = [];
      //   $scope.summary_steps = [];
      //   return;
      // }

      if (!$scope.spinneractive) {
        usSpinnerService.spin('spinner');
      }

      // var weapons = getWeapons();
      // var levels = getLevels();
      // var customizations = transformScopeArray($scope.customizations);
      var methods = [];
      for (var m in $scope.methods) {
        if ($scope.methods[m].value) {
          methods.push($scope.methods[m].index);
        }
      }

      var response;
      $timeout(function() {
        response = getSteps({
          world: $rootScope.world,
          artifacts: getArtifacts(),
          levels: getLevels(),
          weapons: getWeapons(),
          customizations: getCustomizations(),
          skillLevelCrit: $scope.critss,
          skillLevelTDMG: $scope.zerker,
          memory: $scope.memory,
          relics: $scope.relics,
          steps: $scope.nsteps,
          useActives: $scope.active,
          methods: methods,
        });

        console.log("response: ", response);

          // a: artifacts,
          // w: weapons,
          // l: levels,
          // c: customizations,
          // m: methods,
          // r: $scope.relics,
          // n: $scope.nsteps,
          // g: $scope.greedy,
          // s: $scope.active,
          // t: $scope.critss,
          // z: $scope.zerker,
          // y: $scope.memory});

        $scope.$apply(function() {
          $scope.steps = [];
          $scope.summary_steps = [];
          for (var m in response) {
            console.log(response[m]["summary"]);

            $scope.steps[m] = response[m]["steps"];
            $scope.summary_steps[m] = sortByArtifactOrder(response[m]["summary"]);
          }

          if (!($scope.activetab in $scope.steps && $scope.steps[$scope.activetab] != null)) {
            $scope.setActiveTab();
          }

          $scope.updateCookies();
          if ($scope.spinneractive) {
            usSpinnerService.stop('spinner');
          }
        });
      }, 0);
    };

    $scope.resetSteps = function() {
      $scope.stepmessage = "Click calculate to get steps!";
      $scope.steps = [];
      $scope.summary_steps = [];
      $scope.updateCookies();
    };

    $scope.step = function(summary, method, stepindex) {
      var step = summary ? $scope.summary_steps[method][stepindex] : $scope.steps[method][stepindex];

      var cost = step.cost;
      // if this is a summary step, iterate through steps and delete all those with same id
      if (summary) {
        $scope.summary_steps[method].splice(stepindex, 1);
        var toDelete = [];
        for (var s in $scope.steps[method]) {
          if ($scope.steps[method][s].id == step.id) {
            toDelete.push(s);
          }
        }
        toDelete.reverse();
        for (var i in toDelete) {
          $scope.steps[method].splice(toDelete[i], 1);
        }
      } else {
        $scope.steps[method].splice(stepindex, 1);
        // delete from ss if it's the last step
        for (var ss in $scope.summary_steps[method]) {
          var sstep = $scope.summary_steps[method][ss];
          if (sstep.id == step.id && sstep.level == step.level) {
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
          if ($scope.steps[method][s].id == step.id) {
            toDelete.push(s);
            cost += $scope.steps[method][s].cost;
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

      // if step, go through summary and delete from cost
      // if summary step is here, hasn't been deleted
      if (!summary) {
        for (var ss in $scope.summary_steps[method]) {
          var sstep = $scope.summary_steps[method][ss];
          if (sstep.id == step.id) {
            $scope.summary_steps[method][ss].value -= cost;
          }
        }
      }

      for (var a in $scope.artifacts[$rootScope.world]) {
        var artifact = $scope.artifacts[$rootScope.world][a];
        if (artifact.id == step.id) {
          artifact.level = step.level;
          $scope.relics -= cost;
          break;
        }
      }
      $scope.relics = Math.max($scope.relics, 0);
      $scope.$parent.updateSS(6, $scope.relics);
      // TODO: impact on other methods (grey out?)

      $scope.stateChanged(1);
    };

    // TODO: this is a copy
    var cMapping = {
      "0": 2, // gold dropped
      "1": 1, // crit damage
      "2": 4, // crit chance
      "3": 0, // all damage
      "4": 5, // tap damage
      "5": 3  // chest gold
    };

    // TODO: fix this
    var parseCustomizations = function(s) {
      var c = [0, 0, 0, 0, 0, 0];
      s.split("/").forEach(function(p, i, array) {
        c[cMapping[p[0]]] += customizationMapping[p].value;
      });
      return c.map(function(f) { return parseFloat(f.toPrecision(3)); });
    };

    $scope.loadFromFile = function() {
      if (!isNonNull($scope.savefile) || $scope.savefile == "") {
        return;
      }
      var b = $scope.savefile.indexOf("playerInfoSaveString");
      var e = $scope.savefile.indexOf("lastUsedTexture");
      var s = $scope.savefile.substring(b + 22, e-2);
      // http://pastebin.com/Fz0pz0BV
      var j = JSON.parse(JSON.parse(s));

      // TODO: artifact_mapping {}
      // var artifactOrder = getOrderList();
      var artifactLevels = {};
      for (var a in j.artifactLevels) {
        var i = parseInt(a.substring(8));
        var l = j.artifactLevels[a];
        artifactLevels[i] = parseInt(l);
        // TODO: save artifacts to state
        // var artifact = artifactMapping[i];

        // var ai = artifactOrder[i-1];
        // artifactLevels[ai] = parseInt(l);
      }
      for (var w in $scope.artifacts) {
        for (var i in $scope.artifacts[w]) {
          var t = Number(artifactLevels[$scope.artifacts[w][i].id]);
          $scope.artifacts[w][i].level = (isNaN(t) ? 0 : t);
        }
      }
      // for (var a in $scope.artifacts) {
      //   var t = Number(artifactLevels[$scope.artifacts[a].index]);
      //   $scope.artifacts[a].value = (isNaN(t) ? 0 : t);
      // }

      var weapons = j.heroSave.heroWeaponUpgrades;
      for (var w in weapons) {
        $scope.heroes[w-1].weapons = parseInt(weapons[w]);
      }

      var levels = j.heroSave.heroLevels;
      for (var l in levels) {
        $scope.heroes[l-1].level[1] = Math.max(parseInt(levels[l]), $scope.heroes[l-1].level[1]);
      }

      var levels2 = j.heroSave.heroLevelsGirl;
      for (var l in levels2) {
        $scope.heroes[l-1].level[2] = Math.max(parseInt(levels2[l]), $scope.heroes[l-1].level[2]);
      }

      var customizations = parseCustomizations(j.unlockedPlayerCustomizations);
      for (var c in customizations) {
        $scope.customizations[c].value = customizations[c];
      }

      // TODO: set other variables
      $scope.relics = Math.round(parseFloat(j.playerRelics));
      $scope.a_currentSeed = parseInt(j.nextArtifactSeed);
      $scope.w_currentSeed = parseInt(j.heroSave.heroWeaponSeed);

      // update root scope
      $scope.$parent.updateSS(0, j.lastSavedVersion);
      // $scope.$parent.updateSS(1, $scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join());
      $scope.$parent.updateSS(2, $scope.heroes.map(function(h) { return h.weapons; }).join());
      $scope.$parent.updateSS(3, $scope.heroes.map(function(h) { return h.level; }).join());
      $scope.$parent.updateSS(4, $scope.customizations.map(function(c) { return c.value; }).join());
      $scope.$parent.updateSS(6, $scope.relics);
      $scope.$parent.updateSS(16, $scope.a_currentSeed);
      $scope.$parent.updateSS(19, $scope.w_currentSeed);

      $scope.maxStageSPM = j.trophyProgressGirl.ReachStage.progress;
      $scope.memory = 2 * $scope.maxStageSPM / 100.00;
      $scope.$parent.updateSS(21, $scope.memory);

      // update things
      $scope.updateThings();

      // $scope.$parent.saveStateFile(
      //   [$scope.artifacts.map(function(a) { return a.index + "." + a.value; }).join(),
      //    $scope.heroes.map(function(h) { return h.weapons; }).join(),
      //    $scope.heroes.map(function(h) { return h.level; }).join(),
      //    $scope.customizations.map(function(c) { return c.value; }).join(),
      //    $scope.relics,
      //    $scope.a_currentSeed,
      //    $scope.w_currentSeed].join("|")
      // );
    };

    $scope.saveUserState = function() {
      $scope.$parent.saveState();
    };

    $scope.updateFromState = function() {
      log("updateFromState");
      try {
        console.log($rootScope.state);
        var t = $rootScope.state.split("|");

        var undead = 0;
        var artifacts = [];

        t[1].split(",").forEach(function(a, i, array) {
          var v = a.split(".");
          var aindex = parseOrZero(v[0], parseInt);
          var avalue = parseOrZero(v[1], parseInt);

          if (aindex == 25) {
            undead = avalue;
          }
          artifacts.push({
            // name: artifact_info[aindex].name,
            index: aindex,
            value: avalue
          });
        });

        // brew for 3.0.0
        if (t[0] == "v3.0.0" && artifacts.length < 30) {
          artifacts.push({
            name: artifact_info[29].name,
            index: 29,
            value: 0
          });
        }

        // $scope.artifacts = artifacts;
        t[2].split(",").forEach(function(w, i, array) {
          $scope.heroes[i].weapons = parseOrZero(w, parseInt);
        });
        console.log(t[3]);
        t[3].split(",").forEach(function(l, i, array) {
          $scope.heroes[i].level = parseOrZero(l, parseInt);
        });
        t[4].split(",").forEach(function(c, i, array) {
          $scope.customizations[i].value = parseOrZero(c, parseFloat);
        })
        t[5].split(",").forEach(function(m, i, array) {
          $scope.methods[i].value = m == 1 ? true : false;
        })
        $scope.relics    = parseOrZero(t[6], parseInt);
        $scope.nsteps    = parseOrZero(t[7], parseInt);
        $scope.greedy    = parseOrZero(t[8], parseInt);
        $scope.w_getting = parseOrZero(t[9], parseInt);
        $scope.r_cstage  = parseOrZero(t[10], parseInt);
        $scope.r_undead  = parseOrZero(t[11], parseInt);
        $scope.r_levels  = parseOrZero(t[12], parseInt);
        $scope.active    = parseOrZero(t[13], parseInt) == 1 ? true : false;
        $scope.critss    = parseOrZero(t[14], parseInt);
        $scope.zerker    = parseOrZero(t[15], parseInt);
        $scope.a_currentSeed = parseOrZero(t[16], parseInt);
        $scope.a_aPriorities = t[17].split(",").map(function(p) { return parseOrZero(p, parseInt); });
        $scope.a_maxDiamonds = parseOrZero(t[18], parseInt);
        $scope.w_currentSeed = parseOrZero(t[19], parseInt);
        $scope.w_toCalculate = parseOrZero(t[20], parseInt);

        if (21 in t) {
          $scope.memory = parseOrZero(t[21], parseFloat);
        }

        if ($scope.r_undead == 0) { $scope.r_undead = undead; }
        if ($scope.r_levels == 0) { $scope.r_levels = getLevels().reduce(function(a, b) { return a + b; }); }

        console.log("update things");
        $scope.updateThings();
      } catch (err) {
        console.log("asdf");
        console.log(err);
        localStorageService.remove('state');
        setDefaults();
      }
    };

    $scope.$on('stateUpdate', function() {
      $scope.updateFromState();
    });

    $scope.$on('worldUpdate', function() {
      $scope.updateRelicInfo();
      // $scope.updateWeaponInfo();
      $scope.updateStatsInfo();
    });

    // initialize
    log("initializing things");
    setDefaults();
    // $scope.readFromCookies();
    log("update from state");
    $scope.updateFromState();
    log("update things");
    $scope.updateThings();

    if ("username" in $routeParams) {
      var username = $routeParams.username;
      $scope.$parent.viewingUser(username);
    } else if ("state" in $routeParams) {
      var state = LZString.decompressFromEncodedURIComponent($routeParams.state);
      if (isNonNull(state) && state[0] != "v") {
        console.log(log("old state, don't do anything"));
      } else {
        $rootScope.state = state;
        $scope.updateFromState();
      }
    // $scope.importFromString($rootScope.state, false);

    }
  }
);