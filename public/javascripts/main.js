/* App Module */
var yattoApp = angular.module('yattoApp', [
	'ngRoute', 'ngCookies', 'ngRepeatReorder', 'ui.sortable', 'ui.bootstrap', 'LocalStorageModule'
]);

yattoApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/calculator.html',
				controller: 'CalculatorController'
			}).
			when('/faq', {
				templateUrl: 'partials/faq.html',
				controller: 'FaqController'
			}).
			when('/calculator', {
				templateUrl: 'partials/calculator.html',
				controller: 'CalculatorController'
			}).
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
	}
]);


yattoApp.controller('FaqController', function($scope) {
	MathJax.Hub.Configured();
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});