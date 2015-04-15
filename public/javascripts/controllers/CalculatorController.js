yattoApp.controller('CalculatorController',
	function($scope, $http) {
		var something = "something";
		$scope.steps = "steps";
		$scope.calculate = function(artifacts, weapons, customizations) {
			console.log(artifacts);
			console.log(weapons);
			console.log(customizations);

			var info = {"artifacts" : artifacts, "weapons" : weapons, "customizations" : customizations}
			console.log("controller");
			console.log(info);

			$http({
        method: "GET",
        url: "test",
        params: {"info": info}
      }).success(function(data, status, headers, config) {
      	// console.log($scope.roadmaps);
      	console.log("yay stuff: " + data.content);
      	$scope.steps = data.content;
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