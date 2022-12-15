const mongoose = require('mongoose');

const Summoners = mongoose.model('players', {
	summonerId: String,
	name: String,
	tier: String,
	rank: String,
	wins: {
		type: Number,
		required: true,
		default: 0,
	},
	losses: {
		type: Number,
		required: true,
		default: 0,
	},
});

module.exports = Summoners