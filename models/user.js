var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	username: String,
	password: String,
	state: [{ type: Schema.Types.ObjectId, ref: 'State'}],
});

module.exports = mongoose.model('User', User);