const MatchList = require('../models/MatchList');
const MatchDetails = require('../models/MatchDetails');
const getTeamId = require('./getTeamId');
const getParticipantId = require('./getParticipantId');
const axios = require('axios');
const mongoose = require('mongoose');
const getMatchInformation = require('./getMatchInformation');
const getRetrievedMatch = require('./getRetrievedMatch');

/* 
DESCRIPTION: Use data from querySummoner method such as puuid for Riot API call. 
			 Returns array of recent matchIds that we can loop through and query from database. 
			 If matchIds do not exist in database, then write and save into document.
			 Return data to client from querySummoner and matchDetailsArray that extracts all info from each matchId.
*/

async function queryMatches(queriedSummoner) {
	try {
		const puuid = queriedSummoner.puuid;

		// @desc Use PUUID from summonerIdResponse to retrieve list of recent matches
		const matchIdResponse = await axios.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`
		);

		//array of matchIds
		const newMatchIds = matchIdResponse.data;

		//Update matchIds to MatchList
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
			const queriedMatchDetails = await MatchDetails.findOne({
				matchId: matchId,
			}).select('-_id -summonerId -__v');

			//If matchIds are equal in matchList and matchDetail, then push data from match details to matchDetailsArray
			if (queriedMatchDetails) {
				return getRetrievedMatch(
					queriedSummoner,
					queriedMatchDetails,
					matchDetailsArray,
					newMatchIds
				);
			}
			//If not, then make API calls and write into database
			else {
				return getMatchInformation(
					newMatchIds,
					puuid,
					queriedSummoner,
					matchDetailsArray
				);
			}
		}
		return getMatchInformation(
			newMatchIds,
			puuid,
			queriedSummoner,
			matchDetailsArray
		);
	} catch (error) {
		console.error(error);
	}
}

module.exports = queryMatches;
