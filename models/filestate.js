var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Filestate = Schema({
	user: [{ type: Schema.Types.ObjectId, ref: 'User'}],
	state: String,
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Filestate', Filestate);