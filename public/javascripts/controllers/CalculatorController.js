yattoApp.controller('CalculatorController',
	function($scope, $http) {
		var something = "something";
		
		$scope.calculate = function(artifacts, weapons, customizations) {
			console.log(artifacts);
			console.log(weapons);
			console.log(customizations);

			$http({
        method: "GET",
        url: "test",
      }).success(function(data, status, headers, config) {
      	// console.log($scope.roadmaps);
      	console.log("yay stuff: " + data.content);
      }).error(function(data, status, headers, config) {
      	console.log("boo error");
      });
      //$scope.master = angular.copy(user);
    };

		// $scope.message = "";
  //   $scope.left  = function() {return 100 - $scope.message.length;};
  //   $scope.clear = function() {$scope.message = "";};
  //   $scope.save  = function() {alert("Note Saved");};
});