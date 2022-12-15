const axios = require('axios');
const mongodb = require('mongodb');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const API_KEY = process.env.API_KEY;
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_URI = process.env.CONNECTION_URI;

const getMatch = async (matchId) => {
	// Use the League of Legends API to retrieve match information
	const matchResponse = await axios.get(
		`https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}`,
		{
			headers: {
				'X-Riot-Token': API_URL,
			},
		}
	);

	//Parse the response data to extract the match information
	const matchData = matchResponse.data;
	const match = {
		id: matchData.id,
		duration: matchData.gameDuration,
		mode: matchData.gameMode,
		type: matchData.gameType,
		map: matchData.mapId,
	};
	await matches.insertOne(match);
	const matchDoc = await matches.findOne({ id: matchId });
	console.log(matchDoc);
};

const getPerformance = async (matchId, playerId) => {
	// Use the League of Legends API to retrieve performance information for the player in the specified match
	//const performanceId = `${playerId}-${matchId}`;
	const performanceResponse = await axios.get(
		`https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}/participants?summonerId=${playerId}`,
		{
			headers: {
				'X-Riot-Token': API_KEY,
			},
		}
	);

	// Parse the response data to extract the player's performance in the match
	const performanceData = performanceResponse.data[0];
	const performance = {
		id: performanceId,
		playerId: playerId,
		matchId: matchId,
		champion: performanceData.championId,
		kills: performanceData.stats.kills,
		deaths: performanceData.stats.deaths,
		assists: performanceData.stats.assists,
	};
	await performances.insertOne(performance);
	const performanceDoc = await performances.findOne({ id: performanceId });
	console.log(performanceDoc);
};

module.exports = { getSummonerInfo, getMatch, getPerformance };
