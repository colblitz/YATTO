var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var State = require('../models/state');
var router = express.Router();

var router = express.Router();

var sendSuccess = function(res, content) {
	res.status(200).json({
    success: true,
    content: content
  }).end();
}

router.get('/test', function(req, res) {
	var info = req.query.info;
	var pythonres;
	console.log(info);
	console.log("test in server!");
	console.log("lakjsdlfkjalksdf");
  //sendSuccess(res, pythonres);
});

router.post('/calculate', function(req, res) {
	var info = req.body.info;
	// pythonClient.invoke("get_best", info, function(error, pyres, more) {
	// 	console.log("passing on python response: ");
	// 	console.log(pyres);
	// 	sendSuccess(res, pyres);
	// });
	console.log("done");
});

router.post('/wprobability', function(req, res) {
	var weapons = req.body.weapons;
	if (weapons.reduce(function(a, b) {return a + b;}) == 0) {
		sendSuccess(res, 0);
	} else {
		// pythonClient.invoke("calculate_weapons_probability", weapons, function(error, pyres, more) {
		// 	console.log("w passing on python response: ");
		// 	console.log(pyres);
		// 	sendSuccess(res, pyres);
		// });
	}
	console.log("done");
});
 // client.invoke("test", "World!", function(error, res, more) {
 //    		console.log(res);
	// 		});

module.exports = router;
