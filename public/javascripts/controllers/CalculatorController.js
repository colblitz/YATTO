yattoApp.controller('CalculatorController',
  function($scope, $http, $cookies, $cookieStore, $timeout, $rootScope, $routeParams, localStorageService, usSpinnerService) {
    MathJax.Hub.Configured();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

    var controller = "CalculatorController";

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
          $scope.stateChanged();
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
      log("set defaults");
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
            2: 0
          },
        });
      });

      $scope.ownedCustomizations = [];
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

      $scope.relics = {1: 0, 2: 0};
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

    $scope.filterArtifacts = function (a) {
      return a.world == $rootScope.world;
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

    var getCustomizations = function() {
      return transformScopeArray($scope.customizations);
    }

    $scope.setActiveTab = function() {
      // for initializing active tab
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

      $scope.$parent.loadStateFromCookies();

      $scope.setActiveTab();
    };

    $scope.storeToCookies = function() {
      log("store to cookies");
      localStorageService.set('steps', $scope.steps);
      localStorageService.set('summs', $scope.summary_steps);
      $scope.$parent.saveStateToCookies();
    };

    $scope.updateCookies = function() {
      if ($rootScope.aCookies == 'On') {
        log("update cookies - store to cookies");
        $scope.storeToCookies();
      }
      localStorageService.set('autoc', $rootScope.aCookies);
    };

    $scope.clearAllCookies = function() {
      log("clear all cookies");
      localStorageService.clearAll();
    };

    $scope.updateRelicInfo = function() {
      var uaPercent = ($rootScope.world == 1 ? 0.05 : 0.02);
      var uaMultiplier = 1 + uaPercent * $scope.r_undead;

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

    $scope.updateStatsInfo = function() {
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

    $scope.updateThings = function(updateCookies) {
      log("update things");

      if (updateCookies) { $scope.updateCookies(); }

      // recalculate things
      $scope.updateRelicInfo();
      $scope.updateStatsInfo();
    };

    $scope.stateChanged = function() {
      log("state changed");

      var newStateObject = {
        // mapMap($scope.artifacts, function(l) { return l.map(function(a) { return [a.id, a.level]; }); });
        artifacts: {
          1: $scope.artifacts[1].map(function(a) { return [a.id, a.level]; }),
          2: $scope.artifacts[2].map(function(a) { return [a.id, a.level]; }),
        },
        weapons: $scope.heroes.map(function(h) { return h.weapons; }),
        levels: {
          1: $scope.heroes.map(function(h) { return h.level[1]; }),
          2: $scope.heroes.map(function(h) { return h.level[2]; }),
        },
        customizations: $scope.customizations.map(function(c) { return c.value; }),
        ownedCustomizations: $scope.ownedCustomizations,
        methods: $scope.methods.map(function(m) { return m.value ? 1 : 0; }),
        relics: $scope.relics,
        nsteps: $scope.nsteps,
        relicCStage: $scope.r_cstage,
        relicUndead: $scope.r_undead,
        relicLevels: $scope.r_levels,
        useActives: $scope.active,
        levelCrit: $scope.critss,
        levelTDMG: $scope.zerker,
        memory: $scope.memory,
        artifactCurrentSeed: $scope.artifactCurrentSeed,
        weaponCurrentSeed: $scope.weaponCurrentSeed,
      };

      console.log("newStateObject: ", newStateObject);

      // this broadcasts a stateUpdate, which calls updateThings
      $scope.$parent.loadFromState(newStateObject, controller);
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
      $scope.stateChanged();
    };

    $scope.weaponsCheck = function(i, ai) {
      if ($scope.heroes[i].weapons == null) {
        $scope.heroes[i].weapons = 0;
      }
      $scope.stateChanged();
    };

    $scope.levelsCheck = function(i, ai) {
      if ($scope.heroes[i].level == null) {
        $scope.heroes[i].level = 0;
      }
      $scope.r_levels = getLevels().reduce(function(a, b) { return a + b; });
      $scope.stateChanged();
    };

    $scope.customizationCheck = function(i, ai) {
      if ($scope.customizations[i].value == null) {
        $scope.customizations[i].value = 0;
      }
      $scope.stateChanged();
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
      if ($scope.relics[$rootScope.world] == 0 && $scope.nsteps == 0) {
        $scope.stepmessage = "Get some relics or enter a number of steps!";
        $scope.steps = [];
        $scope.summary_steps = [];
        return;
      }

      if (getLevels().reduce(function(a, b) { return a + b; }, 0) == 0) {
        $scope.stepmessage = "Don't forget to fill in your hero levels - for an explanation of why they're needed check out the FAQ page.";
        $scope.steps = [];
        $scope.summary_steps = [];
        return;
      }

      // TODO: if no artifacts, buy new artifact (put in calculate.js?)

      if (!$scope.spinneractive) {
        usSpinnerService.spin('spinner');
      }

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
          relics: $scope.relics[$rootScope.world],
          steps: $scope.nsteps,
          useActives: $scope.active,
          methods: methods,
        });

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

    $scope.applySteps = function() {
      var active = $scope.tabs.indexOf(true);
      for (var i in $scope.summary_steps[active]) {
        var sstep = $scope.summary_steps[active][i];
        for (var a in $scope.artifacts[$rootScope.world]) {
          var artifact = $scope.artifacts[$rootScope.world][a];
          if (artifact.id == sstep.id) {
            artifact.level = sstep.level;
            $scope.relics[$rootScope.world] -= sstep.cost;
          }
        }
      }
      // delete things
      $scope.steps[active] = [];
      $scope.summary_steps[active] = [];

      $scope.stateChanged();
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

      // actually apply the step
      for (var a in $scope.artifacts[$rootScope.world]) {
        var artifact = $scope.artifacts[$rootScope.world][a];
        if (artifact.id == step.id) {
          artifact.level = step.level;
          $scope.relics[$rootScope.world] -= cost;
          break;
        }
      }
      $scope.relics[$rootScope.world] = Math.max($scope.relics[$rootScope.world], 0);
      // $scope.$parent.updateSS(6, $scope.relics);
      // TODO: impact on other methods (grey out?)

      $scope.stateChanged();
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

    $scope.invalidFile = function() {
      return !isNonNull($scope.savefile) || $scope.savefile == "";
    };

    $scope.loadFromFile = function() {
      if ($scope.invalidFile()) { return; }
      var b = $scope.savefile.indexOf("playerInfoSaveString");
      var e = $scope.savefile.indexOf("lastUsedTexture");
      var s = $scope.savefile.substring(b + 22, e-2);
      // http://pastebin.com/Fz0pz0BV
      var j = JSON.parse(JSON.parse(s));

      var artifactLevels = {};
      for (var a in j.artifactLevels) {
        var i = parseInt(a.substring(8));
        var l = j.artifactLevels[a];
        artifactLevels[i] = parseInt(l);
      }
      for (var w in $scope.artifacts) {
        for (var i in $scope.artifacts[w]) {
          var t = Number(artifactLevels[$scope.artifacts[w][i].id]);
          $scope.artifacts[w][i].level = (isNaN(t) ? 0 : t);
        }
      }

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

      $scope.ownedCustomizations = j.unlockedPlayerCustomizations.split("/");
      var customizations = parseCustomizations(j.unlockedPlayerCustomizations);
      for (var c in customizations) {
        $scope.customizations[c].value = customizations[c];
      }

      // TODO: set other variables
      $scope.relics = {
        1: Math.round(parseFloat(j.playerRelics.replace("+", ""))),
        2: Math.round(parseFloat(j.playerRelicsGirl.replace("+", ""))),
      };

      $scope.artifactCurrentSeed = {
        1: parseInt(j.nextArtifactSeed),
        2: parseInt(j.nextArtifactSeedGirl),
      };
      $scope.weaponCurrentSeed = {
        1: parseInt(j.heroSave.heroWeaponSeed),
        2: parseInt(j.heroSave.heroWeaponSeedGirl),
      };

      $scope.maxStageSPM = j.trophyProgressGirl.ReachStage.progress;
      $scope.memory = 2 * $scope.maxStageSPM;

      $scope.stateChanged();

      // TODO: check what field we want to save
      $scope.$parent.saveStateFile(JSON.stringify({
        artifacts: artifactLevels,
        weapons: $scope.heroes.map(function(h) { return h.weapons; }),
        levels: {
          1: $scope.heroes.map(function(h) { return h.level[1]; }),
          2: $scope.heroes.map(function(h) { return h.level[2]; }),
        },
        customizations: $scope.customizations.map(function(c) { return c.value; }),
        relics: $scope.relics,
        memory: $scope.memory,
        diamonds: j.playerDiamonds,
        maxStage: { 1: j.trophyProgress.ReachStage.progress, 2: j.trophyProgressGirl.ReachStage.progress },
        cheater: j.cheater,
        cheaterReason: j.cheaterReason,
        tournamentPoints: j.tournament.tournamentPoints,
      }));
    };

    $scope.saveUserState = function() {
      $scope.$parent.saveState();
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

        $rootScope.state.methods.forEach(function(m, i) {
          $scope.methods[i].value = (m == 1 ? true : false);
        });

        $scope.relics   = getOrDefault($rootScope.state.relics, 0);
        $scope.nsteps   = getOrDefault($rootScope.state.nsteps, 0);
        $scope.r_cstage = getOrDefault($rootScope.state.relicCStage, 0);
        $scope.r_undead = getOrDefault($rootScope.state.relicUndead, 0);
        $scope.r_levels = getOrDefault($rootScope.state.relicLevels, 0);
        $scope.active   = getOrDefault($rootScope.state.useActives, 0);
        $scope.critss   = getOrDefault($rootScope.state.levelCrit, 0);
        $scope.zerker   = getOrDefault($rootScope.state.levelTDMG, 0);
        $scope.memory   = getOrDefault($rootScope.state.memory, 0);

        // if ($scope.r_undead == 0) { $scope.r_undead = undead; }
        // if ($scope.r_levels == 0) { $scope.r_levels = getLevels().reduce(function(a, b) { return a + b; }); }

        console.log("updateFromState update things");
        $scope.updateThings(updateCookies);
      } catch (err) {
        log("update from state error: " + err);
        setDefaults();
      }
    };

    $scope.$on('stateUpdate', function(event, args) {
      if (args.controller != controller) {
        log("broadcasted state update");
        $scope.updateFromState(true);
      }
    });

    $scope.$on('worldUpdate', function() {
      $scope.updateRelicInfo();
      $scope.updateStatsInfo();
    });

    // initialize
    log("initializing things");
    setDefaults();
    log("initial update from state");
    $scope.updateFromState(false);

    if ("username" in $routeParams) {
      var username = $routeParams.username;
      $scope.$parent.viewingUser(username);
    }

    log("end of calculator");
  }
);