// Get stuff
var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var bCrypt         = require('bcrypt-nodejs');
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var expressSession = require('express-session');
var MongoStore     = require('connect-mongo')(expressSession);

var User  = require('./models/user');
var State = require('./models/state');

// Configuration
mongoose.connect('mongodb://localhost:27017/yatto');

// Set up express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
	secret: 'what is this secret',
	resave: false,
	saveUninitialized: false,
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore(
		{mongooseConnection:mongoose.connection},
		function(err){
			console.log(err || 'connect-mongodb setup ok');
		})
}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json()); // ?
// app.use(express.urlencoded()); // ?


passport.serializeUser(function(user, done) {
	console.log('serializing user: ');
	console.log(user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log("id: " + id);
	User.findById(id, function(err, user) {
		console.log('deserializing user:',user);
		console.log("error: " + err);
		done(err, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());

// Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
}

passport.use('login', new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) {
		// check in mongo if a user with username exists or not
		User.findOne({ 'username' :  username },
			function(err, user) {
				// In case of any error, return using the done method
				if (err) {
					console.log("there was an error 1: " + err);
					return done(err);
				}

				// Username does not exist, log the error and redirect back
				if (!user){
					console.log('User Not Found with username '+username);
					// return done(null, false, req.flash('message', 'User Not found.'));
					return done(null, false, 'User Not found.');
				}
				// User exists but wrong password, log the error
				if (!isValidPassword(user, password)){
					console.log('Invalid Password');
						// return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
						return done(null, false, 'Invalid Password'); // redirect back to login page
					}
				// User and password both match, return user from done method
				// which will be treated like success
				return done(null, user);
			}
		);
	})
);

passport.use('register', new LocalStrategy({
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {
		findOrCreateUser = function(){
			// find a user in Mongo with provided username
			User.findOne({ 'username' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: '+err);
					return done(err);
				}
				// already exists
				if (user) {
					console.log('User already exists with username: '+username);
					return done(null, false, "User " + username + " Already Exists");
				} else {
					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.username = username;
					newUser.password = createHash(password);

					// save the user
					newUser.save(function(err) {
							if (err){
									console.log('Error in Saving user: '+err);
									throw err;
							}
							console.log('User Registration succesful');
							return done(null, newUser);
					});
				}
			});
		};
		// Delay the execution of findOrCreateUser and execute the method
		// in the next tick of the event loop
		process.nextTick(findOrCreateUser);
	})
);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
