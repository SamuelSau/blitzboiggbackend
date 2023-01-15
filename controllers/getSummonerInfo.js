const axios = require('axios');
const querySummoner = require('./querySummoners');
const queryMatches = require('./queryMatches')

const API_KEY = process.env.API_KEY;

//Set headers for each axios League of Legends API call
axios.interceptors.request.use(function (config) {
	config.headers['X-Riot-Token'] = API_KEY;
	return config;
});

const getSummonerInfo = async (summonerName) => {
	const queriedSummoner = await querySummoner(summonerName);
	const queriedMatches = await queryMatches(queriedSummoner);
	return queriedMatches
};

module.exports = getSummonerInfo;
