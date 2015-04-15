var express = require('express');
var zerorpc = require("zerorpc");

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
	console.log("test in server!");
	pythonClient.invoke("test", "fromexpress", function(error, res, more) {
		console.log("response: " + res);
	});
	console.log("lakjsdlfkjalksdf");
  sendSuccess(res, "from server to client");
});

 // client.invoke("test", "World!", function(error, res, more) {
 //    		console.log(res);
	// 		});

module.exports = router;
