const mongoose = require('mongoose');

const Summoners = mongoose.model('summoners', {
	summonerId: String,
	puuid: String,
	profileIcon: {
		type: Number,
		required: false,
		default: 5528,
	},
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