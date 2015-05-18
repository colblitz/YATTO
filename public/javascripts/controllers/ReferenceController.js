yattoApp.controller('ReferenceController',
	function($scope, shareVariables) {
		MathJax.Hub.Configured();
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  		console.log("lakjsldjflkajsdf");
  		console.log(shareVariables.getVariable("artifacts"));


  		$scope.r_artifacts = [];

  		for (var i in artifact_info) {
  			var a = artifact_info[i];
  			var artifact = {
  				name: a.name,
  				index: i,
  				ad0: a.ad0,
  				adpl: a.adpl,
  				cap: a.levelcap,
  				x: 1,
  				y: 2,
  				current: 3,
  				desired: 4,
  				cost: 5,
  				cumulative: 6,
  				stats: 7
  			};
  			$scope.r_artifacts.push(artifact);
  		}

  		console.log(artifact_info);

	}
);