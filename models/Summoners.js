const mongoose = require('mongoose');

const Summoners = mongoose.model('summoners', {
	summonerId: String,
	puuid: String,
	accountId: String,
	revisionDate: Number,
	summonerLevel: Number,
	queueType: {
		type: String,
		require: false,
		default: '',
	},
	profileIconId: Number,
	name: {
		type: String,
		required: true,
	},
	tier: {
		type: String,
		require: false,
		default: '',
	},
	rank: {
		type: String,
		require: false,
		default: '',
	},
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

module.exports = Summoners;
