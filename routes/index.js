var express = require('express');
var zerorpc = require("zerorpc");
var Heap = require("heap");

var router = express.Router();
var pythonClient = new zerorpc.Client();
pythonClient.connect("tcp://127.0.0.1:4242");

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
	pythonClient.invoke("test", info, function(error, pyres, more) {
		pythonres = pyres;
		console.log("response: " + pyres);
		sendSuccess(res, pyres);
	});
	console.log("lakjsdlfkjalksdf");
  //sendSuccess(res, pythonres);
});

router.post('/calculate', function(req, res) {
	var info = req.body.info;
	pythonClient.invoke("get_best", info, function(error, pyres, more) {
		console.log("passing on python response: ");
		console.log(pyres);
		sendSuccess(res, pyres);
	});
	console.log("done");
});

router.post('/wprobability', function(req, res) {
	var weapons = req.body.weapons;
	if (weapons.reduce(function(a, b) {return a + b;}) == 0) {
		sendSuccess(res, 0);
	} else {
		pythonClient.invoke("calculate_weapons_probability", weapons, function(error, pyres, more) {
			console.log("w passing on python response: ");
			console.log(pyres);
			sendSuccess(res, pyres);
		});
	}
	console.log("done");
});
 // client.invoke("test", "World!", function(error, res, more) {
 //    		console.log(res);
	// 		});

module.exports = router;
