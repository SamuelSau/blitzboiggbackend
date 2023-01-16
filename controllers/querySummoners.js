const Summoners = require('../models/Summoners');
const MatchList = require('../models/MatchList');
const axios = require('axios');
const mongoose = require('mongoose');

/* 
DESCRIPTION: Call Riot API endpoint using summonerName
			 If summonerId exist in database we query. 
			 Else, make another API call to write and save into documents for future queries.
			 Return data for queryMatches method.
*/

async function querySummoner(summonerName) {
	try {
		// Use summonerName to retrieve player's summonerId
		const summonerIdResponse = await axios.get(
			`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
		);
		//Extract summonerId from API call
		const summonerId = summonerIdResponse.data['id'];

		//Query summonerId from Summoners collection in mongoose
		const player = await Summoners.findOne({ summonerId: summonerId });

		//return data immeditaly if player does exist in our database
		if (player) {
			return {
				name: player.name,
				summonerLevel: player.summonerLevel,
				puuid: player.puuid,
				revisionDate: player.revisionDate,
				profileIconId: player.profileIconId,
				queueType: player.queueType,
				rank: player.rank,
				tier: player.tier,
				wins: player.wins,
				losses: player.losses,	
			};
		}

		/* Else */
		// Use summonerID from summonerIDResponse to retrieve player's stats
		const summmonerStatsResponse = await axios.get(
			`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerIdResponse.data.id}`
		)

		// Parse the response data to extract the player and match information
		const accountId = summonerIdResponse.data['accountId'];
		const revisionDate = summonerIdResponse.data['revisionDate'];
		const profileIconId = summonerIdResponse.data['profileIconId'];
		const puuid = summonerIdResponse.data['puuid'];
		const playerName = summonerIdResponse.data['name'];
		const playerId = summonerIdResponse.data['id'];
		const summonerLevel = summonerIdResponse.data['summonerLevel'];
		const summonerData = summmonerStatsResponse.data; //is an array

		//Handles empty response if summoner doesn't play certain queue gamemodes from LoL API
		if(summonerData.length === 0){
			summonerData.queueType = "UNKNOWN";
			summonerData.tier = "UNKNOWN";
			summonerData.rank = "UNKNOWN";
			summonerData.wins = 0;
			summonerData.losses = 0;
		}
		
		const summoner = {
			name: playerName,
			accountId: accountId,
			revisionDate: revisionDate,
			summonerId: playerId,
			puuid: puuid,
			profileIconId: profileIconId,
			summonerLevel: summonerLevel,
			queueType: summonerData[0].queueType,
			tier: summonerData[0].tier,
			rank: summonerData[0].rank,
			wins: summonerData[0].wins,
			losses: summonerData[0].losses,
		};


		const match = {
			puuid: puuid,
		};

		// Create a new player document using the player data
		const newSummoner = new Summoners(summoner);
		newSummoner.save((error, doc) => {
			if (error) console.log(error);
			else console.log('Player document saved successfully.');
		});

		//Create a new match document using puuid
		const newMatch = new MatchList(match);
		newMatch.save((error, doc) => {
			if (error) console.log(error);
			else console.log('Match document saved successfully');
		});

		//Still return player information from the Riot API endpoints
		return {
			name: playerName,
			puuid: puuid,
			profileIconId: profileIconId,
			summonerLevel: summonerLevel,
			queueType: summonerData.queueType,
			tier: summonerData.tier,
			rank: summonerData.rank,
			wins: summonerData.wins,
			losses: summonerData.losses,
		};
	} catch (error) {
		
		if (error.request) {
			console.log(error.request);
		}

		else if (error.response) {
			console.log(error.response);
		}

		else {
			console.log(error.message)
		}
	}
}

module.exports = querySummoner;
