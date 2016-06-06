/* App Module */
var yattoApp = angular.module('yattoApp', [
  'ngRoute', 'ngCookies', 'ngRepeatReorder', 'ui.sortable', 'ui.bootstrap', 'LocalStorageModule', 'angularSpinner'
]);

yattoApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/calculator.html',
        controller: 'CalculatorController'
      }).
      when('/calculator', {
        templateUrl: 'partials/calculator.html',
        controller: 'CalculatorController'
      }).
      when('/othercalc', {
        templateUrl: 'partials/othercalc.html',
        controller: 'OtherCalcController'
      }).
      when('/faq', {
        templateUrl: 'partials/faq.html',
        controller: 'FaqController'
      }).
      when('/reference', {
        templateUrl: 'partials/reference.html',
        controller: 'ReferenceController'
      }).
      when('/formulas', {
        templateUrl: 'partials/formulas.html',
        controller: 'FormulasController'
      }).
      when('/sequencer', {
        templateUrl: 'partials/sequencer.html',
        controller: 'SequencerController'
      }).
      otherwise({
        templateUrl: 'partials/calculator.html',
        controller: 'CalculatorController'
      });
  }
]);

yattoApp.directive("fileread", [function () {
  return {
    scope: {
      fileread: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
          });
        }
        console.log("lakjsldkjflakjsldf");
        var file = changeEvent.target.files[0];
        var extension = file.name.split(".").pop();
        if (extension == "adat" || extension == "bin") {
          reader.readAsText(file);
        } else {
          // TODO: display error
        }
      });
    }
  }
}]);

yattoApp.directive('reddit', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: { user : '@' },
    controller: function($scope) {},
    template: '<a href="http://www.reddit.com/user/{{user}}">/u/{{user}}</a>'
  };
});

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

yattoApp.controller('FaqController', function($scope) {
  MathJax.Hub.Configured();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

yattoApp.controller('FormulasController', function($scope) {
  MathJax.Hub.Configured();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

// --------------------------------------------------------------------------------------------------------------
// ----- Stuff for Random ---------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

// TODO: refactor
var unityRandomW1 = [];
var unityRandomW2 = [];

var processData = function(data) {
  for (var i in data) {
    unityRandomW1.push({
      nextSeed: parseInt(data[i][1]),
      values: data[i].slice(2).map(Number)
    });
  }
};

var processDataW2 = function(data) {
  for (var i in data) {
    unityRandomW2.push({
      nextSeed: parseInt(data[i][1]),
      values: data[i].slice(2).map(Number)
    });
  }
};

$.ajax({
  url: "../saved_data - Copy.csv",
  async: false,
  dataType: "text",
  success: function(data) {
    processData($.csv2Array(data));
  }
});

$.ajax({
  url: "../artifact_order_public - Random40.csv",
  async: false,
  dataType: "text",
  success: function(data) {
    processDataW2($.csv2Array(data));
  }
});

var MMAX = 2147483647;
var MMIN = -2147483648;
var MSEED = 161803398;

var Random = function(s) {
  var ii;
  var mj, mk;

  this.seedArray = newZeroes(56);
  mj = MSEED - Math.abs(s);
  this.seedArray[55] = mj;
  mk = 1;
  for (var i = 1; i < 55; i++) {
    ii = (21 * i) % 55;
    this.seedArray[ii] = mk;
    mk = mj - mk;
    if (mk < 0) { mk += MMAX; }
    mj = this.seedArray[ii];
  }
  for (var k = 1; k < 5; k++) {
    for (var i = 1; i < 56; i++) {
      this.seedArray[i] -= this.seedArray[1 + ((i + 30) % 55)];
      if (this.seedArray[i] < 0) { this.seedArray[i] += MMAX; }
    }
  }
  this.inext = 0;
  this.inextp = 31;

  this.next = function(minValue, maxValue) {
    if (minValue > maxValue) {
      // error, blakhskd jfhkajesh f
    }
    var range = maxValue - minValue;
    if (range <= 1) {
      return minValue;
    }
    return Math.floor(this.sample() * range) + minValue;
  };

  // returns double
  this.sample = function() {
    if (++this.inext >= 56) { this.inext = 1; }
    if (++this.inextp >= 56) { this.inextp = 1; }
    var num = this.seedArray[this.inext] - this.seedArray[this.inextp];
    if (num < 0) { num += MMAX; }
    this.seedArray[this.inext] = num;
    return (num * 4.6566128752457969E-10);
  };
}

// --------------------------------------------------------------------------------------------------------------
// ----- Utility ------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

var isNonNull = function(thing) {
  return typeof thing !== "undefined" && thing != null;
};

var getOrDefault = function(thing, dValue) {
  return isNonNull(thing) ? thing : dValue;
};

/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
var occurrences = function(string, subString, allowOverlapping){
  string+=""; subString+="";
  if(subString.length<=0) return string.length+1;

  var n=0, pos=0;
  var step=(allowOverlapping)?(1):(subString.length);

  while(true){
      pos=string.indexOf(subString,pos);
      if(pos>=0){ n++; pos+=step; } else break;
  }
  return(n);
};

var parseOrZero = function(s, f) {
  var i = f(s);
  if (i == null || isNaN(i)) {
    i = 0;
  }
  return i;
};

var newZeroes = function(length) {
  return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
};

var mapMap = function(map, f) {
  var newMap = {};
  for (var k in map) {
    newMap[k] = f(map[k]);
  }
  return newMap;
};

// var mapValuesToArray = function(map, f) {

// };

// --------------------------------------------------------------------------------------------------------------
// ----- BinaryHeap ---------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

/*
  array implementation of a binary heap, example usage:
  // can optionally provide a comparison function, a function for a max
  // heap is the default if no comparison function is provided
  var bh = binaryHeap();
  bh.push(5);
  bh.push(34);
  bh.push(16);
  var max = bh.pop(); // 34
  print("number in heap: " + bh.size()) // 2
 */
var binaryHeap = function(comp) {

  // default to max heap if comparator not provided
  comp = comp || function(a, b) {
    return a > b;
  };

  var arr = [];

  var swap = function(a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  };

  var bubbleDown = function(pos) {
    var left = 2 * pos + 1;
    var right = left + 1;
    var largest = pos;
    if (left < arr.length && comp(arr[left], arr[largest])) {
      largest = left;
    }
    if (right < arr.length && comp(arr[right], arr[largest])) {
      largest = right;
    }
    if (largest != pos) {
      swap(largest, pos);
      bubbleDown(largest);
    }
  };

  var bubbleUp = function(pos) {
    if (pos <= 0) {
      return;
    }
    var parent = Math.floor((pos - 1) / 2);
    if (comp(arr[pos], arr[parent])) {
      swap(pos, parent);
      bubbleUp(parent);
    }
  };

  var that = {};

  that.pop = function() {
    if (arr.length === 0) {
      throw new Error("pop() called on emtpy binary heap");
    }
    var value = arr[0];
    var last = arr.length - 1;
    arr[0] = arr[last];
    arr.length = last;
    if (last > 0) {
      bubbleDown(0);
    }
    return value;
  };

  that.push = function(value) {
    arr.push(value);
    bubbleUp(arr.length - 1);
  };

  that.size = function() {
    return arr.length;
  };

  that.getArray = function() {
    return arr;
  }

  return that;
};