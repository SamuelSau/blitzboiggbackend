const mongoose = require('mongoose');

const Summoners = mongoose.model('summoners', {
	summonerId: {
		type: String,
		required: true,
	},
	puuid: {
		type: String,
		required: true,
	},
	accountId: {
		type: String,
		required: true,
	},
	revisionDate: {
		type: Number,
		required: false,
		default: 0,
	},
	summonerLevel: {
		type: Number,
		required: true,
	},
	queueType: {
		type: String,
		required: false,
		default: 'UNKNOWN',
	},
	profileIconId: {
		type: Number,
		required: false,
	},
	name: {
		type: String,
		required: true,
	},
	tier: {
		type: String,
		required: false,
		default: 'UNKNOWN',
	},
	rank: {
		type: String,
		required: false,
		default: 'UNKNOWN',
	},
	wins: {
		type: Number,
		required: false,
		default: 0,
	},
	losses: {
		type: Number,
		required: false,
		default: 0,
	},
});

module.exports = Summoners;
