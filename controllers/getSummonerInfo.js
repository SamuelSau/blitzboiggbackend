const Summoners = require('../models/Summoners');
const axios = require('axios');
const dotenv = require('dotenv').config();
const API_KEY = process.env.API_KEY;

//Set headers for each axios API call for League of Legends API
axios.interceptors.request.use(function (config) {
	config.headers['X-Riot-Token'] = API_KEY;
	//config.headers['Content-Type'] = 'application/json';

	return config;
});

const getSummonerInfo = async (summonerName) => {
	// @desc Use summoner name to retrieve summoner's ID
	const summonerIdResponse = await axios.get(
		`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
	);

	// @desc Use summonerID from summonerIDResponse to retrieve player's stats
	const summmonerStatsResponse = await axios.get(
		`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerIdResponse.data.id}`
	);

	// @desc Use PUUID from summonerIdResponse to retrieve list of 20 recent matches
	const matchIdResponse = await axios.get(
		`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerIdResponse.data.puuid}/ids?start=0&count=10`
	);

	// @desc Use matchId from matchIdResponse to retrieve details of each match
	for (let i = 0; i < matchIdResponse.data.length; i++) {
		// Use the match ID to retrieve details of the match
		const matchStatsResponse = await axios.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdResponse.data[i]}`
		);

		
	}

	// Parse the response data to extract the player and match information
	const summonerData = summmonerStatsResponse.data[0];
	//const matchData = matchStatsResponse.data[0];
	//console.log(matchData)
	const summoner = {
		summonerId: summonerData.summonerId,
		puuid: summonerData.puuid,
		name: summonerData.summonerName,
		tier: summonerData.tier,
		rank: summonerData.rank,
		wins: summonerData.wins,
		losses: summonerData.losses,
	};

	//query in database by summonerId
	const foundSummoner = await Summoners.findOne({
		summonerId: summonerData.summonerId,
	});

	if (!foundSummoner) {
		// Create a new player document using the player data
		const newSummoner = new Summoners(summoner);
		return newSummoner.save((error, doc) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Player document saved successfully.');
				//Display that new user has been added to database
			}
		});
	} else {
		return {
			name: foundSummoner.name,
			tier: foundSummoner.tier,
			rank: foundSummoner.rank,
			wins: foundSummoner.wins,
			losses: foundSummoner.losses,
		};
	}
};

module.exports = getSummonerInfo;
