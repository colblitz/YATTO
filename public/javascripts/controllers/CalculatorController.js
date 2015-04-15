yattoApp.controller('CalculatorController',
	function($scope) {
		var something = "something";

		$scope.calculate = function(artifacts, weapons, customizations) {
			console.log(artifacts);
			console.log(weapons);
			console.log(customizations);
      //$scope.master = angular.copy(user);
    };
		// $scope.message = "";
  //   $scope.left  = function() {return 100 - $scope.message.length;};
  //   $scope.clear = function() {$scope.message = "";};
  //   $scope.save  = function() {alert("Note Saved");};
});