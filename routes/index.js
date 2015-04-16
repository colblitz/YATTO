var express = require('express');
// var zerorpc = require("zerorpc");

var router = express.Router();
// var pythonClient = new zerorpc.Client();
// pythonClient.connect("tcp://127.0.0.1:4242");

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
	// pythonClient.invoke("test", info, function(error, pyres, more) {
	// 	pythonres = pyres;
	// 	console.log("response: " + pyres);
	// 	sendSuccess(res, pyres);
	// });
	console.log("lakjsdlfkjalksdf");
  //sendSuccess(res, pythonres);
});

router.post('/test', function(req, res) {
	var info = req.body.info;
	var pythonres;
	console.log(info);
	console.log("test in server!");
	// pythonClient.invoke("test", info, function(error, pyres, more) {
	// 	pythonres = pyres;
	// 	console.log("response: " + pyres);
	// 	sendSuccess(res, pyres);
	// });
	console.log("lakjsdlfkjalksdf");
	sendSuccess(res, "blah blah blah post was successful");
  //sendSuccess(res, pythonres);
});

 // client.invoke("test", "World!", function(error, res, more) {
 //    		console.log(res);
	// 		});

module.exports = router;
