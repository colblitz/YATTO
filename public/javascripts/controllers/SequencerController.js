yattoApp.controller('WeaponModalController', function ($scope, $modalInstance) {
  $scope.alreadySure = false;

  $scope.isSure = function() {
    $modalInstance.close({alreadySure: $scope.alreadySure});
  }

  $scope.justKidding = function() {
    $modalInstance.dismiss('cancel');
  }
});

yattoApp.controller('SequencerController',
  function($scope, $rootScope, $modal, localStorageService) {
    var controller = "SequencerController";
    var verbose = true;
    var log = function(s) {
      if (verbose) {
        console.log("[SequencerController] " + s);
      }
    };

    log("start of file");

    var getCostScaling = function(w) {
      return (w == 1 ? 1.35 : 1.25);
    };

    var costToBuy = function(i, w) {
      return Math.floor((i) * Math.pow(getCostScaling(w), i));
    };

    var salvageCosts = {
      1: {},
      2: {},
    };

    var i = 0;
    while (i < 31) {
      var aCost = costToBuy(i, 1);
      var nCost = costToBuy(i+1, 1);
      var a = aCost + nCost;
      salvageCosts[1][i] = Math.round(Math.pow(5, Math.log(a) / Math.log(10)) + 35);
      i += 1;
    }
    i = 0;
    while (i < 41) {
      var aCost = costToBuy(i, 2);
      var nCost = 0;//costToBuy(i+1, 2);
      var a = (aCost + nCost) * 1;
      salvageCosts[2][i] = Math.round(Math.pow(5, Math.log(a) / Math.log(10)) + 35);
      i += 1;
    }
    console.log(salvageCosts[2]);

    var setDefaults = function() {
      $scope.artifacts = {
        1: [],
        2: [],
      };

      for (var i in artifactInfo) {
        var a = artifactInfo[i];
        $scope.artifacts[a.world].push({
          name: a.name,
          id: a.id,
          owned: false,
          priority: 0,
        });
      }

      for (var w in $scope.artifacts) {
        // $scope.artifacts[w].sort(function(a, b) { return a.id - b.id; })
        $scope.artifacts[w].sort(function(a, b) { return a.name.localeCompare(b.name); })
      }

      $scope.salvageInt = 0;
      $scope.salvageError = "";
      $scope.artifactCurrentSeed = {1: 0, 2: 0};
      $scope.artifactMaxDiamonds = 0;
      $scope.artifactCostManual = 0;
      $scope.artifactCostAuto = 0;
      $scope.artifactBestSteps = [];
      $scope.artifactBestScore = 0;
      $scope.timer = null;
      $scope.running = false;
      $scope.artifactSteps = [];

      $scope.weapons = [];
      for (var i in heroInfo) {
        $scope.weapons.push({
          name: heroInfo[i].name,
          current: 0,
          after: 0,
        });
      }

      $scope.weaponSteps = [];
      $scope.weaponCurrentSeed = {1: 0, 2: 0};
      $scope.weaponToCalculate = 100;
      $scope.weaponConfirm = false;
      $scope.weaponMinCurrent = 0;
      $scope.weaponMinAfter = 0;

      // $scope.salvageInt = 0;
      // $scope.a_currentSeed = 0;
      // $scope.a_maxDiamonds = 0;
      // $scope.timer = null;
      // $scope.salvageError = "";
      // $scope.cost_manual = 0;
      // $scope.cost_auto = 0;
      // $scope.best_steps = [];
      // $scope.best_score = 0;
      // $scope.running = false;

      // $scope.w_steps = [];
      // $scope.w_currentSeed = 0;
      // $scope.w_toCalculate = 100;
      // $scope.w_confirm = false;
      // $scope.weapons = [];
      // $scope.current_min = 0;
      // $scope.after_min = 0;

      $scope.c = [0, 1, 2, 3];
      $scope.columns = [];
      $scope.columnCount = 4;
      $scope.alreadySure = false;
    };

 //           10   11     12     13     14    14    14     15    15
    // var slist = [false, false, false, true, true, false, true, false];
    var getCostOfSalvages = function(owned, slist) {
      var i = owned + 1;
      var cost = 0;
      for (var s in slist) {
        if (!slist[s]) {
          i += 1;
        } else {
          console.log("getCostOfSalvages");
          console.log($rootScope.world);
          console.log(i);
          console.log(salvageCosts[$rootScope.world][i]);
          cost += salvageCosts[$rootScope.world][i];
        }
      }
      return cost;
    };

    var getOwned = function() {
      return $scope.artifacts[$rootScope.world].filter(function(a) {
        return a.owned;
      }).length;
    };

    // TODO: Make this not depend on unityRandom
    $scope.getList = function(slist) {
      log("get list");
      var steps = [];
      var currentSeed = $scope.artifactCurrentSeed[$rootScope.world];
      // TODO: artifact_mapping {}
      var list = $scope.artifacts[$rootScope.world].filter(function(a) {
        return !a.owned;
      });
      list.sort(function(a, b) { return a.id - b.id; });

      console.log("current seed: " + currentSeed);
      var salvages = (slist == null ? $scope.artifactSteps.map(function(s) { return s.salvage; }) : slist);
      console.log("salvages");
      console.log(salvages);


      // var salvages = [];
      // if (slist == null) {
      //   salvages = $scope.artifactSteps.map(function(s) { return s.salvage; });
      // }
      // if (!reset && isNonNull($scope.artifactSteps)) {
      //   salvages = $scope.artifactSteps.map(function(s) { return s.salvage; });
      // }
      // if (slist != null) {
      //   salvages = slist;
      // }
      var unityRandom = ($rootScope.world == 1 ? unityRandomW1 : unityRandomW2);

      console.log("owned");
      console.log(getOwned() + 1);

      var num = getOwned() + 1;
      while (list.length > 0) {
        if (list.length == 1) {
          var next = list[0].id;
          var keep = !salvages[steps.length];

          steps.push({
            n: keep ? num + "." : "",
            id: next,
            name: artifactMapping[next].name,
            salvage: !keep
          });
          if (keep) {
            list = [];
            num += 1;
          }
          currentSeed = unityRandom[currentSeed].nextSeed;
        } else {
          var totalArtifacts = $scope.artifacts[$rootScope.world].length;
          var numOwned = totalArtifacts - list.length;
          var index = unityRandom[currentSeed].values[numOwned];
          var next = list[index].id;
          var keep = !salvages[steps.length];

          if (keep) {
            list.splice(index, 1);
          }
          steps.push({
            n: keep ? num + "." : "",
            id: next,
            name: artifactMapping[next].name,
            salvage: !keep
          });
          if (keep) {
            num += 1;
          }
          currentSeed = unityRandom[currentSeed].nextSeed;
          // console.log("seed now: " + currentSeed);
        }
      }

      return steps;
    };

    var scoreAList = function(l) {
      var score = 0;
      var p = l.length;
      var priorities = {};
      $scope.artifacts[$rootScope.world].forEach(function(a, i) {
        priorities[a.id] = a.priority;
      });
      // console.log("--------");
      for (var a in l) {
        var ap = priorities[l[a]];
        // console.log(ap);
        // var artifact = $scope.artifacts[$rootScope.world].find(function(sa) { return sa.id == l[a]; });
        // var ap = artifact.priority;
        score += ap * p;
        // score += Math.pow(ap/10, p);
        // score += $scope.s_artifacts[l[a].index].priority * p * p;
        p -= 1;
      }
      return score;
    };

    // var pp = function(p) {1
    //   if (p.length == 0) {
    //     return "[]";
    //   }
    //   return p;
    // };

    var intToSalvage = function(i) {
      var s = (i >>> 0).toString(2);
      var sl = [];
      for (var l = s.length - 1; l >= 0; l--) {
        sl.push(s[l] == "1");
      }
      return sl;
    };

    $scope.reset = function() {
      for (var s in $scope.artifacts[$rootScope.world]) {
        $scope.artifacts[$rootScope.world][s].priority = 0;
      }
      $scope.resetSearch();
    };

    $scope.resetSearch = function() {
      clearInterval($scope.timer);
      $scope.salvageInt = 0;
      $scope.salvageError = "";
      $scope.artifactBestSteps = null;
      $scope.artifactBestScore = 0;
      $scope.running = false;
    };

    var startSearching = function() {
      $scope.$apply(function() {
        var tryList = intToSalvage($scope.salvageInt);
        var cost = getCostOfSalvages(getOwned(), tryList);
        if ($scope.artifactMaxDiamonds == 0 || cost < $scope.artifactMaxDiamonds) {
          var a = $scope.getList(tryList);
          var f = a.filter(function(step) { return !step.salvage; }).map(function(step) { return step.id; });
          var newScore = scoreAList(f);
          if (newScore > $scope.artifactBestScore) {
            $scope.artifactBestScore = newScore;
            $scope.artifactBestSteps = a;
            $scope.artifactCostAuto = cost;
          }
        }
        $scope.salvageInt += 1;
      });
    };


    $scope.start = function() {
      if ($scope.artifacts[$rootScope.world].map(function(a) { return a.priority; })
                            .reduce(function(a, b) { return a + b; }, 0) == 0) {
        $scope.salvageError = "Need to set priorities!";
      } else {
        $scope.timer = setInterval(startSearching, 0);
        $scope.running = true;
      }
    };

    $scope.stop = function() {
      clearInterval($scope.timer);
      $scope.running = false;
    };

    $scope.weaponConfirm = function() {
      if ($scope.weaponConfirm) {
        calculateWeapons();
      } else {
        $scope.weaponConfirm = true;
      }
    };

    var calculateColumns = function() {
      var itemsPerColumn = Math.ceil($scope.weaponSteps.length / $scope.columnCount);
      $scope.columns = [];
      $scope.columns.push($scope.weaponSteps.slice(0, itemsPerColumn));
      $scope.columns.push($scope.weaponSteps.slice(itemsPerColumn, itemsPerColumn*2));
      $scope.columns.push($scope.weaponSteps.slice(itemsPerColumn*2, itemsPerColumn*3));
      $scope.columns.push($scope.weaponSteps.slice(itemsPerColumn*3));
    };

    $scope.check = function(index) {
      var newSteps = [];
      var newi = 0;
      for (var w in $scope.weaponSteps) {
        if (w < index) {
          $scope.weapons[$scope.weaponSteps[w].wi].current += 1;
        } else {
          var weapon = $scope.weaponSteps[w];
          newSteps.push({
            index: newi + 1,
            seed: weapon.seed,
            weapon: weapon.weapon,
            wi: weapon.wi,
            typeclass: weapon.typeclass,
            premium: weapon.premium
          })
          newi += 1;
        }
      }

      $scope.weaponSteps = newSteps;
      $scope.weaponCurrentSeed[$rootScope.world] = $scope.weaponSteps[0].seed;
      $scope.weaponMinCurrent = Math.min.apply(null, $scope.weapons.map(function(x) { return x.current; }));
      // $scope.after_min = Math.min.apply(null, $scope.weapons.map(function(x) { return x.a; }));

      calculateColumns();

      $scope.weaponStateChanged();
    };

    $scope.openModal = function() {
      if (!$scope.alreadySure) {
        var modalInstance = $modal.open({
          templateUrl: 'weaponModal.html',
          controller: 'WeaponModalController',
          size: 'md',
          resolve: {
            alreadySure: function() {
              return $scope.alreadySure;
            }
          }
        });

        modalInstance.result.then(function (info) {
          $scope.alreadySure = info.alreadySure;
          localStorageService.set('asure', $scope.alreadySure);
          $scope.calculateWeapons();
        }, function () {
          return;
        });
      } else {
        $scope.calculateWeapons();
      }
    };

    $scope.calculateWeapons = function() {
      if ($scope.weaponToCalculate > 1000) {
        $scope.weaponToCalculate = 1000;
      }
      var currentSeed = $scope.weaponCurrentSeed[$rootScope.world];
      for (var i in $scope.weapons) {
        $scope.weapons[i].after = $scope.weapons[i].current;
      }

      $scope.weaponSteps =[];
      for (var i = 0; i < $scope.weaponToCalculate; i++) {
        if (currentSeed == 0) {
          console.log("gg");
        }
        var random = new Random(currentSeed);
        var nextSeed = random.next(1, 2147483647);
        var weapon = random.next(1, 34);

        $scope.weaponSteps.push({
          index: i + 1,
          seed: currentSeed,
          weapon: heroToName[weapon],
          wi: weapon - 1,
          // currentWeapons: $.extend(true, [], $scope.weapons)//,
          //typeclass: cssclass
        });

        $scope.weapons[weapon - 1].after += 1;
        currentSeed = nextSeed;
      }

      $scope.weaponMinCurrent = Math.min.apply(null, $scope.weapons.map(function(x) { return x.current; }));
      $scope.weaponMinAfter = Math.min.apply(null, $scope.weapons.map(function(x) { return x.after; }));

      $scope.recolorWeapons();

      calculateColumns();
    };

    $scope.calculatePremiums = function(windex) {
      // var w = $scope.w_steps[i];
      // if (w.premium) {
      //  var min = Math.min.apply(null, w.currentWeapons.map(function(x) { return x.a; }));
      //  var possible = [];
      //  for (var i in w.currentWeapons) {
      //    if (w.currentWeapons[i].a == min) {
      //      possible.push(i);
      //    }
      //  }

      //  var random = new Random(w.seed);
      //  var nextSeed = random.next(1, 2147483647);
      //  var newIndex = random.next(0, possible.length);
      //  var newWeapon = parseInt(possible[newIndex]);

      //  w.weapon = heroToName[newWeapon + 1];
      //  w.wi = newWeapon;
      // } else {
      //  var random = new Random(w.seed);
      //  var nextSeed = random.next(1, 2147483647);
      //  var weapon = random.next(1, 34);

      //  w.weapon = heroToName[weapon];
      //  w.wi = weapon - 1;
      // }

      for (var i in $scope.weapons) {
        $scope.weapons[i].after = $scope.weapons[i].current;
      }

      $scope.weaponSteps.forEach(function(w, i) {
        var weapon = w.wi;

        if (w.premium) {
          var min = Math.min.apply(null, $scope.weapons.map(function(x) { return x.after; }));
          var possible = [];
          for (var i in $scope.weapons) {
            if ($scope.weapons[i].after == min) {
              possible.push(i);
            }
          }

          var random = new Random(w.seed);
          var nextSeed = random.next(1, 2147483647);
          var newIndex = random.next(0, possible.length);
          var newWeapon = parseInt(possible[newIndex]);
          w.weapon = heroToName[newWeapon + 1];
          w.wi = newWeapon;
          weapon = newWeapon;
        } else if (i == windex) {
          var random = new Random(w.seed);
          var nextSeed = random.next(1, 2147483647);
          var weapon = random.next(1, 34);

          w.weapon = heroToName[weapon];
          w.wi = weapon - 1;
        }

        // The calculation of the weapon var fails for darklord ("33"),
        // should be "32" as far as I know
        // For other heros it seems to work (e.g Jackalope -> "31")
        if (weapon == 33) {
          weapon -= 1 ;
        }

        // execption occrus here for var weapon = 33, DL
        // since the array is only filled up to 32
        $scope.weapons[weapon].after += 1;
      });


      $scope.recolorWeapons();
    };

    $scope.recolorWeapons = function() {
      for (var i in $scope.weapons) {
        $scope.weapons[i].after = $scope.weapons[i].current;
      }

      $scope.weaponSteps.forEach(function(w, i) {
        var weapon = w.wi;
        var indexOfMaxValue = $scope.weapons.map(
          function(x) { return x.after; }).reduce(
          function(iMax, x, i, a) { return x > a[iMax] ? i : iMax; }, 0);

        var cssclass = "";
        var before = Math.min.apply(null, $scope.weapons.map(function(x) { return x.after; }));
        $scope.weapons[weapon].after += 1;
        var after = Math.min.apply(null, $scope.weapons.map(function(x) { return x.after; }));

        if (before == after) {
          if (weapon == 32) {
            cssclass = "darklord";
          } else if (weapon == indexOfMaxValue) {
            cssclass = "maxweapon";
          } else if ($scope.weapons[weapon].after - 1 == before) {
            cssclass = "minweapon";
          }
        } else {
          cssclass = "newset";
        }

        //var cssclass = before == after ? (weapon == 33 ? "darklord" : "") : "newset";

        w.typeclass = cssclass;
      });
    };

    $scope.pullFromRoot = function() {
      var ownedArtifacts = {};
      for (var w in $rootScope.state.artifacts) {
        $rootScope.state.artifacts[w].forEach(function(p, i) {
          if (p[1] > 0) {
            ownedArtifacts[p[0]] = true;
          }
        });
      }

      var priorities = {};
      for (var w in $rootScope.state.artifactPriorities) {
        $rootScope.state.artifactPriorities[w].forEach(function(p, i) {
          priorities[p[0]] = p[1];
        });
      }

      for (var w in $scope.artifacts) {
        $scope.artifacts[w].forEach(function(a, i) {
          a.owned = (a.id in ownedArtifacts);
          a.priority = getOrDefault(priorities[a.id], 0);
        });
      }

      $scope.artifactSteps = $scope.getList(null);
      $scope.artifactCostManual = getCostOfSalvages(getOwned(), $scope.artifactSteps.map(function(s) { return s.salvage; }));
      $scope.artifactCurrentSeed = getOrDefault($rootScope.state.artifactCurrentSeed, {1: 0, 2: 0});
      $scope.weaponCurrentSeed = getOrDefault($rootScope.state.weaponCurrentSeed, {1: 0, 2: 0});
    };


    $scope.updateFromState = function() {
      log("update from state");

      console.log($rootScope.state);

      var priorities = {};
      if ($rootScope.state.artifactPriorities) {
        $rootScope.state.artifactPriorities.forEach(function(p, i) {
          priorities[p[0]] = p[1];
        });
      }

      for (var w in $scope.artifacts) {
        $scope.artifacts[w].forEach(function(a, i) {
          a.priority = getOrDefault(priorities[a.id], 0);
        });
      }

      $scope.artifactCurrentSeed = getOrDefault($rootScope.state.artifactCurrentSeed, {1: 0, 2: 0});
      $scope.artifactMaxDiamonds = getOrDefault($rootScope.state.artifactMaxDiamonds, 0);

      $scope.weapons = [];
      $rootScope.state.weapons.forEach(function(w, i) {
        $scope.weapons.push({
          name: heroToName[i + 1],
          current: w,
          after: w,
        });
      });

      $scope.weaponMinCurrent = Math.min.apply(null, $scope.weapons.map(function(x) { return x.current; }));
      $scope.weaponMinAfter = Math.min.apply(null, $scope.weapons.map(function(x) { return x.after; }));

      $scope.weaponCurrentSeed = getOrDefault($rootScope.state.weaponCurrentSeed, {1: 0, 2: 0});
      $scope.weaponToCalculate = getOrDefault($rootScope.state.weaponToCalculate, 100);

      // $scope.stateChanged();
    };

    $scope.stateChanged = function(reList, stopSearch, updateRoot) {
      console.log("state changed");
      if (reList) {
        $scope.artifactSteps = $scope.getList(null);
        console.log("state changed");
        console.log(getOwned());
        console.log($scope.artifactSteps.map(function(s) { return s.salvage; }));
        $scope.artifactCostManual = getCostOfSalvages(getOwned(), $scope.artifactSteps.map(function(s) { return s.salvage; }));
      }
      if (stopSearch) {
        $scope.resetSearch();
      }

      if (updateRoot) {
        var priorities = [].concat(
          $scope.artifacts[1].map(function(a) { return [a.id, a.priority]; }),
          $scope.artifacts[2].map(function(a) { return [a.id, a.priority]; }));
        console.log(priorities);

        // update root state
        var newStateObject = {
          artifactCurrentSeed: $scope.artifactCurrentSeed,
          artifactMaxDiamonds: $scope.artifactMaxDiamonds,
          artifactPriorities: priorities,
        };
        // TODO: redo this
        $scope.$parent.loadFromState(newStateObject, controller);
        $scope.$parent.saveState();
        if ($rootScope.aCookies) {
          $scope.$parent.saveStateToCookies();
        }
      }
    };



    $scope.weaponStateChanged = function() {
      var newStateObject = {
        weapons: $scope.weapons.map(function(x) { return x.current; }),
        weaponCurrentSeed: $scope.weaponCurrentSeed,
        weaponToCalculate: $scope.weaponToCalculate,
      };
      // TODO: redo this
      $scope.$parent.loadFromState(newStateObject, controller);
      $scope.$parent.saveState();
      if ($rootScope.aCookies) {
        $scope.$parent.saveStateToCookies();
      }
    };

    $scope.saveUserState = function() {
      $scope.$parent.saveState();
    };

    $scope.$on('stateUpdate', function() {
      if (args.controller != controller) {
        log("broadcasted state update");
        $scope.updateFromState();
      }
    });

    $scope.$on('worldUpdate', function() {
      $scope.artifactSteps = $scope.getList(null);
      console.log("world update");
        $scope.artifactCostManual = getCostOfSalvages(getOwned(), $scope.artifactSteps.map(function(s) { return s.salvage; }));
    });

    setDefaults();
    console.log("init");
    $scope.updateFromState();
    // $scope.stateChanged(true);
    // get things from cookies

    var asure = localStorageService.get('asure');
    if (isNonNull(asure)) { $scope.alreadySure = asure; }
    $scope.pullFromRoot();
    log("end of sequencer");
  }
);
