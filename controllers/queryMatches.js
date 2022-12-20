const MatchList = require('../models/MatchList');
const axios = require('axios');
const mongoose = require('mongoose');

async function queryMatches(puuid) {
	try {
		// @desc Use PUUID from summonerIdResponse to retrieve list of 20 recent matches
		const matchIdResponse = await axios.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`
		);

		const match = await Summoners.findOne({ puuid: puuid });


        // @todo check if match exists, return data to client immediately

        
        //@todo else make number of API calls dependent on count of matches in matchIdResponse 

		// @desc Use matchId from matchIdResponse to retrieve details of each match
		for (let i = 0; i < matchIdResponse.data.length; i++) {
			// Use the match ID to retrieve details of the match
			const matchStatsResponse = await axios.get(
				`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdResponse.data[i]}`
			);
			console.log(matchStatsResponse.data['info']['gameCreation']);
		}
	} catch (error) {
		console.error(error);
	}
}
