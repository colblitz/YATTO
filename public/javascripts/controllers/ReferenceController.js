yattoApp.controller('ReferenceController',
	function($scope) {
		MathJax.Hub.Configured();
  		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	}
);