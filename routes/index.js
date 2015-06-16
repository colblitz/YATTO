var express = require('express');
var router = express.Router();

var sendSuccess = function(res, content) {
	res.status(200).json({
		success: true,
		content: content
	}).end();
};

var sendErrResponse = function(res, err) {
	res.status(400).json({
		success: false,
		err: err
	}).end();
};

module.exports = function(passport) {
	router.get('/test', function(req, res) {
		console.log("req: " + req);
		console.log("req user: " + req.user);
		console.log("res: " + res);
		console.log("res user: " + res.user);
		console.log("test in server!");
		console.log("lakjsdlfkjalksdf");
		sendSuccess(res, "fuck");
	});

	router.post('/check', function(req, res) {
		if (req.user != null) {
			console.log("sending back user");
			sendSuccess(res, req.user);
			return;
		}
		sendSuccess(res, null);
	});

	router.post('/register', function(req, res, next) {
		passport.authenticate('register', function(err, user, info) {
			if (err) { sendErrResponse(res, err); return; }
			if (!user) { sendErrResponse(res, info); return; }
			req.logIn(user, function(err) {
				if (err) { sendErrResponse(res, err); }
				sendSuccess(res, user);
			});
		})(req, res, next);
	});

	router.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			console.log("after authenticate");
			if (err) { sendErrResponse(res, err); return; }
			if (!user) { sendErrResponse(res, info); return; }
			req.logIn(user, function(err) {
				if (err) { sendErrResponse(res, err); }
				console.log("sending back user:");
				console.log(user);
				sendSuccess(res, { username: user.username, state: user.state });
			});
		})(req, res, next);
	});

	router.post('/logout', function(req, res, next) {
		if (req.isAuthenticated()) {
			req.logOut();
		}
		sendSuccess(res, null);
	});

	return router;
}