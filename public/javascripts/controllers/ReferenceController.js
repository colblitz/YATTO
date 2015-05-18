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
  				cap: isFinite(a.levelcap) ? a.levelcap : null,
  				x: a.x.toFixed(1),
  				y: a.y.toFixed(1),
  				current: 0,
  				desired: 0,
  				cost: 0,
  				cumulative: 0,
  				stats: "",
  				costf: a.cost
  			};
  			$scope.r_artifacts.push(artifact);
  		}

  		console.log(artifact_info);

	}
);