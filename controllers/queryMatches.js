const MatchList = require('../models/MatchList');
const MatchDetails = require('../models/MatchDetails');
const axios = require('axios');
const mongoose = require('mongoose');
const getMatchInformation = require('./getMatchInformation');

/* 
DESCRIPTION: Use data from querySummoner method such as puuid for Riot API call. 
			 Returns array of recent matchIds that we can loop through and query from database. 
			 If matchIds do not exist in database, then write and save into document.
			 Return data to client from querySummoner and matchDetailsArray that extracts all info from each matchId.
*/

async function queryMatches(queriedSummoner) {
	try {
		const puuid = queriedSummoner.puuid;

		//Use PUUID from summonerIdResponse to retrieve list of recent matches
		const matchIdResponse = await axios.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`
		);

		//array of current matchIds from the Riot API
		const newMatchIds = matchIdResponse.data;

		//Update the current matchIds to MatchList
		MatchList.findOneAndUpdate(
			{ puuid: puuid },
			{ $set: { matchIds: newMatchIds } },
			{ new: true },
			(error, doc) => {
				if (error) console.log(error);
				else console.log('MatchList document updated successfully');
			}
		);

		//return details for each match to client
		const matchDetailsArray = [];
		
		//query specific player's matches
		const matches = await MatchList.findOne({ puuid: puuid });

		for (const matchId of matches.matchIds) {
			//Compare matchId from MatchList and from MatchDetails document
			const matchDatabaseInformation = await MatchDetails.findOne({
				matchId: matchId,
			}).select('-_id -summonerId -__v');

			//If matchIds are equal in MatchList and MatchDetails
			if (matchDatabaseInformation) {
				matchDetailsArray.push(matchDatabaseInformation);
			}
			//If not, then make API calls and write into database
			else {
				const matchInformation = await getMatchInformation(
					matchId,
					puuid,
					matchDetailsArray
				);
				matchDetailsArray.push(matchInformation);
			}
		}

		//return regardless if not exist in database or first time searching
		return {
			name: queriedSummoner.name,
			profileIconId: queriedSummoner.profileIconId,
			summonerLevel: queriedSummoner.summonerLevel,
			queueType: queriedSummoner.queueType,
			rank: queriedSummoner.rank,
			tier: queriedSummoner.tier,
			wins: queriedSummoner.wins,
			losses: queriedSummoner.losses,
			matchDetailsArray,
		};
	} catch (error) {
		console.error(error);
	}
}

module.exports = queryMatches;
