var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var State = Schema({
	user: [{ type: Schema.Types.ObjectId, ref: 'User'}],
	state: String,
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('State', State);