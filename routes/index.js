var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user');
var State = require('../models/state');
var Filestate = require('../models/filestate');
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
    sendSuccess(res, "asdf");
  });

  router.post('/check', function(req, res) {
    if (req.user != null) {
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
      if (err) { sendErrResponse(res, err); return; }
      if (!user) { sendErrResponse(res, info); return; }
      req.logIn(user, function(err) {
        if (err) { sendErrResponse(res, err); }
        State.findOne({'user':user._id}, function(err, state) {
          if (err) {
            console.log("error finding state: " + err);
            sendErrResponse(res, err);
          } else if (state) {
            console.log("found state after login");
            console.log(state);
            sendSuccess(res, { username: user.username, state: state });
          } else {
            console.log("blah");
            sendSuccess(res, { username: user.username });
            // sendErrResponse(res, "No state found for user");
          }
        }).sort({'date':-1}).limit(1);
      });
    })(req, res, next);
  });

  router.post('/logout', function(req, res, next) {
    if (req.isAuthenticated()) {
      req.logOut();
    }
    sendSuccess(res, null);
  });

  router.post('/state', function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("user: " + req.user.username);
      console.log("user: " + req.user.id);
      console.log("received: " + req.body.state);

      var newState = new State();
      var userId = mongoose.Types.ObjectId(req.user.id)
      newState.state = req.body.state;
      newState.user = userId;

      State.remove({'user':userId}, function(err) {
        if (!err) {
          console.log("deleted for user " + userId);

          newState.save(function(err) {
            if (err) {
              console.log("Error saving state: " + err);
              sendErrResponse(res, err);
              return;
            }
            console.log("State successfully saved");
          });
          sendSuccess(res, null);
        } else {
          console.log("error deleting: " + err);
        }
      });

      // State.find({'user':userId}).

      // State.find({'user':userId}).count(function(error, n) {
   //     console.log("callback");
   //     console.log(n);

   //     var l = Math.max(0, n-5);
   //     State.find({'user':userId}, function(err, states) {
   //       console.log("find");
   //       console.log(states);
   //     }).sort({'date':1}).limit(l);
      // });

      // State.find({'user':userId}).count(function(error, n) {
   //     console.log("second ");
   //     console.log(n);

   //     if (n > 5) {
    //      var l = Math.max(0, n-5);
    //      State.remove({'user':userId}, function(err, states) {
    //        console.log("delete");
    //        console.log(states);
    //      }).sort({'date':1}).limit(l);
    //    }
      // });

      // State.find({'user':userId}).count(function(error, n) {
   //     console.log("after");
   //     console.log(n);
      // });


//      db.collection.find().skip(db.collection.count() - N)
// If you want them in the reverse order:

// db.collection.find().sort({ $natural: -1 }).limit(N)


    } else {
      console.log("not authenticated");
    }
  });

  router.post('/filestate', function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("user: " + req.user.username);
      console.log("user: " + req.user.id);
      console.log("received: " + req.body.state);

      var newState = new Filestate();
      var userId = mongoose.Types.ObjectId(req.user.id)
      newState.state = req.body.state;
      newState.user = userId;
      newState.save(function(err) {
        if (err) {
          console.log("Error saving state: " + err);
          sendErrResponse(res, err);
          return;
        }
        console.log("Filestate successfully saved");
      });
      sendSuccess(res, null);
    } else {
      console.log("not authenticated");
    }
  });

  router.get('/state', function(req, res) {
    console.log("getting state for username: " + req.query.username);
    User.findOne({'username': req.query.username}, function(err, user) {
      if (err) {
        console.log("error finding user: " + err);
        sendErrResponse(res, err);
      } else if (user) {
        console.log(user);
        console.log("found user, id is: " + user._id);
        State.findOne({'user':user._id}, function(err, state) {
          if (err) {
            console.log("error finding state: " + err);
            sendErrResponse(res, err);
          } else if (state) {
            console.log("found state");
            console.log(state);
            sendSuccess(res, state.state);
          } else {
            console.log("blah");
            sendErrResponse(res, "No state found for user");
          }
        }).sort({'date':-1}).limit(1);
      } else {
        console.log("no user");
        sendErrResponse(res, "No user found");
      }
    });
  });

  return router;
}