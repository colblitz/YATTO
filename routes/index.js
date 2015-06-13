var express = require('express');
var router = express.Router();

// var passport = require('passport');
// var User = require('../models/user');
// var State = require('../models/state');


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

// var isAuthenticated = function (req, res, next) {
// 	// if user is authenticated in the session, call the next() to call the next request handler
// 	// Passport adds this method to request object. A middleware is allowed to add properties to
// 	// request and response objects
// 	if (req.isAuthenticated()) {
// 		return next();
// 	} else {
// 		console.log("not authenticated");
// 	}
// 	// if the user is not authenticated then redirect him to the login page
// 	// res.redirect('/');
// }

module.exports = function(passport) {
// module.exports = function(passport){
	router.get('/test', function(req, res) {
		// var info = req.query.info;
		// var pythonres;
		// console.log(info);
		console.log("test in server!");
		console.log("lakjsdlfkjalksdf");
	  sendSuccess(res, "fuck");
	});

	// router.post('/register', passport.authenticate('register'), function(req, res) {
	// 	var body = req.body;
	// 	console.log("in index.js login:");
	// 	console.log(body);
	// 	sendSuccess(res, {user : req.user});
	//   //sendSuccess(res, pythonres);
	// });

	router.post('/register', function(req, res, next) {
		passport.authenticate('register', function(err, user, info) {
			if (err) { sendErrResponse(res, err); }
			if (!user) { sendErrResponse(res, info); }
			req.logIn(user, function(err) {
	      if (err) { sendErrResponse(res, err); }
	      sendSuccess(res, "yay new user created: " + user);
	    });
			// login with new user
			// sendSuccess(res, "new user created");
		})(req, res, next);
	});

	router.post('/login', function(req, res, next) {
	  passport.authenticate('login', function(err, user, info) {
	  	console.log("after authenticate");
	    if (err) { sendErrResponse(res, err); }
	    if (!user) {
	    	console.log("no user");
	    	sendErrResponse(res, "no such user");
	    	console.log("alkjsldfjk");
	    	return;
	    }
	    req.logIn(user, function(err) {
	      if (err) { sendErrResponse(res, err); }
	      sendSuccess(res, "yay you got logged in: " + user);
	    });
	  })(req, res, next);
	});

// 	app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });

	// router.post('/register', function(req, res) {
	// 	console.log("in register");
	// 	console.log(req.body.username);
	// 	console.log(req.body.password);
	// 	User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
	// 		if (err) {
	// 			console.log("error: " + err);
	// 			sendErrResponse(res, err);
	// 		}

	// 		passport.authenticate('local')(req, res, function() {
	// 			console.log("it worked?");
	// 		});
	// 	});
	// });

	// router.post('/login', passport.authenticate('local'), function(req, res) {
	// 	var body = req.body;
	// 	console.log("in index.js login:");
	// 	console.log(body);
	// 	sendSuccess(res, {user : req.user});
	//   //sendSuccess(res, pythonres);
	// });

	// router.post('/login', passport.authenticate('login', {
	// 	successRedirect: '/home',
	// 	failureRedirect: '/',
	// 	failureFlash : true
	// }));

	// router.post('/login', passport.authenticate('local', function (err, account) {
	//   req.logIn(account, function() {
	//     res.status(err ? 500 : 200).send(err ? err : account);
	//   });
	// })(this.req, this.res, this.next);

	// router.post('/login', function(req, res, next) {
	//   passport.authenticate('local', function(err, user, info) {
	//     if (err) { sendErrResponse(err); }
	//     if (!user) { sendErrResponse("no such user"); }
	//     req.logIn(user, function(err) {
	//       if (err) { sendErrResponse(err); }
	//       sendSuccess("yay you got logged in: " + user);
	//     });
	//   })(req, res, next);
	// });

	// router.post('/login', function(req, res) {
	// 	var info = req.body.info;
	// 	console.log("info: " + info);
	// 	// pythonClient.invoke("get_best", info, function(error, pyres, more) {
	// 	// 	console.log("passing on python response: ");
	// 	// 	console.log(pyres);
	// 	// 	sendSuccess(res, pyres);
	// 	// });
	// 	console.log("done");
	// });

	// router.post('/calculate', function(req, res) {
	// 	var info = req.body.info;
	// 	// pythonClient.invoke("get_best", info, function(error, pyres, more) {
	// 	// 	console.log("passing on python response: ");
	// 	// 	console.log(pyres);
	// 	// 	sendSuccess(res, pyres);
	// 	// });
	// 	console.log("done");
	// });

	// router.post('/wprobability', function(req, res) {
	// 	var weapons = req.body.weapons;
	// 	if (weapons.reduce(function(a, b) {return a + b;}) == 0) {
	// 		sendSuccess(res, 0);
	// 	} else {
	// 		// pythonClient.invoke("calculate_weapons_probability", weapons, function(error, pyres, more) {
	// 		// 	console.log("w passing on python response: ");
	// 		// 	console.log(pyres);
	// 		// 	sendSuccess(res, pyres);
	// 		// });
	// 	}
	// 	console.log("done");
	// });
	 // client.invoke("test", "World!", function(error, res, more) {
	 //    		console.log(res);
		// 		});


	return router;
}