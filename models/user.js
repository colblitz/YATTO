var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: String,
	password: String,
	state: [{ type: Schema.Types.ObjectId, ref: 'State'}],
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);