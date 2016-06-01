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
    var costToBuy = function(i) {
      return Math.floor((i) * Math.pow(1.35, i));
    };

    var salvageCosts = {};

    var i = 0;
    while (i < 31) {
      var aCost = costToBuy(i);
      var nCost = costToBuy(i+1);
      var a = (aCost + nCost) * 1;
      salvageCosts[i] = Math.round(Math.pow(5, Math.log(a) / Math.log(10)) + 35);
      i += 1;
    }

    var setDefaults = function() {
      $scope.s_artifacts = [];
      for (var i in artifactInfo) {
        var a = artifactInfo[i];
        var artifact = {
          name: a.name,
          index: i,
          owned: false,
          priority: 0
        };
        $scope.s_artifacts.push(artifact);
      }
      $scope.salvageint = 0;
      $scope.a_currentSeed = 0;
      $scope.a_maxDiamonds = 0;
      $scope.timer = null;
      $scope.salvageError = "";
      $scope.cost_manual = 0;
      $scope.cost_auto = 0;
      $scope.best_steps = [];
      $scope.best_score = 0;
      $scope.running = false;

      $scope.w_steps = [];
      $scope.w_currentSeed = 0;
      $scope.w_toCalculate = 100;
      $scope.w_confirm = false;
      $scope.current_weapons = [];
      $scope.current_min = 0;
      $scope.after_min = 0;

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
          cost += salvageCosts[i];
        }
      }
      return cost;
    };


    var getOwned = function() {
      // TODO: artifact_mapping {}
      return getOrderList().filter(function(x) {
        return $scope.s_artifacts[x].owned;
      }).length;
    };

    // TODO: Make this not depend on unityRandom
    $scope.getList = function(reset, slist) {
      var steps = [];
      var currentSeed = $scope.a_currentSeed;
      // TODO: artifact_mapping {}
      var list = getOrderList().filter(function(x) {
        return !$scope.s_artifacts[x].owned;
      });

      var salvages = [];
      if (!reset && isNonNull($scope.steps)) {
        salvages = $scope.steps.map(function(s) { return s.salvage; });
      }
      if (slist != null) {
        salvages = slist;
      }

      var num = getOwned() + 1;
      while (list.length > 0) {
        if (list.length == 1) {
          var next = list[0];
          var keep = !salvages[steps.length];

          steps.push({
            n: keep ? num + "." : "",
            index: next,
            name: artifactInfo[next].name,
            salvage: !keep
          });
          if (keep) {
            list = [];
            num += 1;
          }
          currentSeed = unityRandom[currentSeed].nextSeed;
        } else {
          var numOwned = 30 - list.length;
          var index = unityRandom[currentSeed].values[numOwned];
          var next = list[index];
          var keep = !salvages[steps.length];

          if (keep) {
            list.splice(index, 1);
          }
          steps.push({
            n: keep ? num + "." : "",
            index: next,
            name: artifactInfo[next].name,
            salvage: !keep
          });
          if (keep) {
            num += 1;
          }
          currentSeed = unityRandom[currentSeed].nextSeed;
        }
      }

      return steps;
    };

    var scoreAList = function(l) {
      var score = 0;
      var p = l.length;
      for (var a in l) {
        var ap = $scope.s_artifacts[l[a]].priority;
        score += ap * p;
        // score += Math.pow(ap/10, p);
        // score += $scope.s_artifacts[l[a].index].priority * p * p;
        p -= 1;
      }
      return score;
    };

    var pp = function(p) {
      if (p.length == 0) {
        return "[]";
      }
      return p;
    };

    var intToSalvage = function(i) {
      var s = (i >>> 0).toString(2);
      var sl = [];
      for (var l = s.length - 1; l >= 0; l--) {
        sl.push(s[l] == "1");
      }
      return sl;
    };

    $scope.reset = function() {
      for (var s in $scope.s_artifacts) {
        $scope.s_artifacts[s].priority = 0;
      }
      $scope.resetSearch();
    };

    $scope.resetSearch = function() {
      clearInterval($scope.timer);
      $scope.salvageint = 0;
      $scope.salvageError = "";
      $scope.best_steps = null;
      $scope.best_score = 0;
      $scope.running = false;
    };

    var startSearching = function() {
      $scope.$apply(function() {
        var tryList = intToSalvage($scope.salvageint);
        var cost = getCostOfSalvages(getOwned(), tryList);
        if ($scope.a_maxDiamonds == 0 || cost < $scope.a_maxDiamonds) {
          var a = $scope.getList(false, tryList);
          var f = a.filter(function(step) { return !step.salvage; }).map(function(step) { return step.index; });
          var newScore = scoreAList(f);
          if (newScore > $scope.best_score) {
            $scope.best_score = newScore;
            $scope.best_steps = a;
            $scope.cost_auto = cost;
          }
        }
        $scope.salvageint += 1;
      });
    };


    $scope.start = function() {
      if ($scope.s_artifacts.map(function(a) { return a.priority; })
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
      if ($scope.w_confirm) {
        calculateWeapons();
      } else {
        $scope.w_confirm = true;
      }
    };

    var calculateColumns = function() {
      var itemsPerColumn = Math.ceil($scope.w_steps.length / $scope.columnCount);
      $scope.columns = [];
      $scope.columns.push($scope.w_steps.slice(0, itemsPerColumn));
      $scope.columns.push($scope.w_steps.slice(itemsPerColumn, itemsPerColumn*2));
      $scope.columns.push($scope.w_steps.slice(itemsPerColumn*2, itemsPerColumn*3));
      $scope.columns.push($scope.w_steps.slice(itemsPerColumn*3));
    };

    $scope.check = function(index) {
      var new_w = [];
      var newi = 0;
      for (var w in $scope.w_steps) {
        if (w < index) {
          $scope.current_weapons[$scope.w_steps[w].wi].n += 1;
        } else {
          var weapon = $scope.w_steps[w];
          new_w.push({
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

      $scope.w_steps = new_w;
      $scope.w_currentSeed = $scope.w_steps[0].seed;
      $scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
      // $scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));

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
      if ($scope.w_toCalculate > 1000) {
        $scope.w_toCalculate = 1000;
      }
      var currentSeed = $scope.w_currentSeed;
      for (var i in $scope.current_weapons) {
        $scope.current_weapons[i].a = $scope.current_weapons[i].n;
      }

      $scope.w_steps =[];
      for (var i = 0; i < $scope.w_toCalculate; i++) {
        if (currentSeed == 0) {
          console.log("gg");
        }
        var random = new Random(currentSeed);
        var nextSeed = random.next(1, 2147483647);
        var weapon = random.next(1, 34);

        $scope.w_steps.push({
          index: i + 1,
          seed: currentSeed,
          weapon: heroToName[weapon],
          wi: weapon - 1
          // currentWeapons: $.extend(true, [], $scope.current_weapons)//,
          //typeclass: cssclass
        });

        $scope.current_weapons[weapon - 1].a += 1;
        currentSeed = nextSeed;
      }

      $scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
      $scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));

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

      for (var i in $scope.current_weapons) {
        $scope.current_weapons[i].a = $scope.current_weapons[i].n;
      }

      $scope.w_steps.forEach(function(w, i) {
        var weapon = w.wi;

        if (w.premium) {
          var min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));
          var possible = [];
          for (var i in $scope.current_weapons) {
            if ($scope.current_weapons[i].a == min) {
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
        $scope.current_weapons[weapon].a += 1;
      });


      $scope.recolorWeapons();
    };

    $scope.recolorWeapons = function() {
      for (var i in $scope.current_weapons) {
        $scope.current_weapons[i].a = $scope.current_weapons[i].n;
      }

      $scope.w_steps.forEach(function(w, i) {
        var weapon = w.wi;
        var indexOfMaxValue = $scope.current_weapons.map(
          function(x) { return x.a; }).reduce(
          function(iMax,x,i,a) {return x>a[iMax] ? i : iMax;}, 0);

        var cssclass = "";
        var before = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));
        $scope.current_weapons[weapon].a += 1;
        var after = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));

        if (before == after) {
          if (weapon == 32) {
            cssclass = "darklord";
          } else if (weapon == indexOfMaxValue) {
            cssclass = "maxweapon";
          } else if ($scope.current_weapons[weapon].a - 1 == before) {
            cssclass = "minweapon";
          }
        } else {
          cssclass = "newset";
        }

        //var cssclass = before == after ? (weapon == 33 ? "darklord" : "") : "newset";

        w.typeclass = cssclass;
      });
    };


    $scope.updateFromState = function() {
      var t = $rootScope.state.split("|");

      var artifacts = [];
      t[1].split(",").forEach(function(a, i, array) {
        var v = a.split(".");
        var aindex = parseOrZero(v[0], parseInt);
        var avalue = parseOrZero(v[1], parseInt);
        artifacts.push({
          name: artifactInfo[aindex].name,
          index: aindex,
          value: avalue
        });
      });

      var weapons = t[2].split(",").map(function(w) { return parseOrZero(w, parseInt); });

      $scope.a_currentSeed = parseOrZero(t[16], parseInt);
      $scope.a_aPriorities = t[17].split(",").map(function(p) { return parseOrZero(p, parseInt); });
      $scope.a_maxDiamonds = parseOrZero(t[18], parseInt);
      $scope.w_currentSeed = parseOrZero(t[19], parseInt);
      $scope.w_toCalculate = parseOrZero(t[20], parseInt);

      for (var i in artifacts) {
        var a = artifacts[i];
        $scope.s_artifacts[a.index].owned = a.value != 0;
      }

      $scope.current_weapons = [];
      for (var i in weapons) {
        var index = parseInt(i);
        $scope.current_weapons.push({
          name: heroToName[index + 1],
          n: weapons[index],
          a: weapons[index]
        });
      }

      $scope.current_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.n; }));
      $scope.after_min = Math.min.apply(null, $scope.current_weapons.map(function(x) { return x.a; }));
    };

    $scope.initialize = function() {
      $scope.updateFromState();
    };

    $scope.updateRootScope = function() {
      $scope.$parent.updateSS(2, $scope.current_weapons.map(function(w) { return w.n; }).join());
      $scope.$parent.updateSS(16, $scope.a_currentSeed);
      $scope.$parent.updateSS(17, $scope.a_aPriorities);
      $scope.$parent.updateSS(18, $scope.a_maxDiamonds);
      $scope.$parent.updateSS(19, $scope.w_currentSeed);
      $scope.$parent.updateSS(20, $scope.w_toCalculate);

      if ($rootScope.aCookies == 'On') {
        $scope.$parent.saveS();
      }

      // if ($rootScope.loggedIn) {
      //  $scope.$parent.saveState();
      // }
    }

    $scope.stateChanged = function(reset, stopSearch, skip) {
      if (!skip) {
        $scope.steps = $scope.getList(reset, null);
        $scope.cost_manual = getCostOfSalvages(getOwned(), $scope.steps.map(function(s) { return s.salvage; }));
      }
      if (stopSearch) {
        $scope.resetSearch();
      }
      $scope.updateRootScope();
    };

    $scope.weaponStateChanged = function() {
      $scope.updateRootScope();
    };

    $scope.saveUserState = function() {
      $scope.$parent.saveState();
    };

    setDefaults();

    // get things from cookies
    var asure = localStorageService.get('asure');
    if (isNonNull(asure)) { $scope.alreadySure = asure; }

    $scope.initialize();
    $scope.stateChanged(true);

    $scope.$on('stateUpdate', function() {
      $scope.updateFromState();
    });
  }
);
