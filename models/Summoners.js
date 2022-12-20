const mongoose = require('mongoose');

const Summoners = mongoose.model('summoners', {
	summonerId: String,
	puuid: String,
	queueType: String,
	profileIconId: Number,
	name: {
		type: String,
		required: true,
	},
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