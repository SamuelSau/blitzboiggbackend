const Summoners = require('../models/Summoners');
const axios = require('axios');
const querySummoner = require('./querySummoners');
const queryMatches = require('./queryMatches')
const dotenv = require('dotenv').config();
const API_KEY = process.env.API_KEY;

//Set headers for each axios API call for League of Legends API
axios.interceptors.request.use(function (config) {
	config.headers['X-Riot-Token'] = API_KEY;
	//config.headers['Content-Type'] = 'application/json';

	return config;
});

const getSummonerInfo = async (summonerName) => {
	
	const queriedSummoner = await querySummoner(summonerName);
	//console.log(queriedSummoner.puuid)
	const queriedMatches = await queryMatches(queriedSummoner);
	console.log(queriedMatches)
};

module.exports = getSummonerInfo;
