/* App Module */
var yattoApp = angular.module('yattoApp', [
	'ngRoute', 'ngCookies', 'ngRepeatReorder'
]);

yattoApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/calculator.html',
        controller: 'CalculatorController'
      }).
      // when('/home', {
      //   templateUrl: 'partials/home.html',
      //   controller: 'HomePageController'
      // }).
      // when('/roadmaps/:id', {
      //   templateUrl: 'partials/roadmap.html',
      //   controller: 'RoadmapPageController'
      // }).
      // when('/edit', {
      //   templateUrl: 'partials/edit.html',
      //   controller: 'EditPageController'
      // }).
      otherwise({
        templateUrl: 'partials/calculator.html',
        controller: 'CalculatorController'
      });
  }]);
