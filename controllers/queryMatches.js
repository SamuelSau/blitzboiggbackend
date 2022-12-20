const MatchList = require('../models/MatchList');
const MatchDetails = require('../models/MatchDetails');
const axios = require('axios');
const mongoose = require('mongoose');

async function queryMatches(queriedSummoner) {
	try {
		const puuid = queriedSummoner.puuid;

		// @desc Use PUUID from summonerIdResponse to retrieve list of recent matches
		const matchIdResponse = await axios.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`
		);

		//const match = await MatchList.findOne({ puuid: puuid });

		//Checks if match exists, then update list of matches from puuid
		//if (match) {
		const newMatchIds = matchIdResponse.data;
		//console.log(newMatchIds)

		//Update matchIds from MatchList based on puuid
		MatchList.findOneAndUpdate(
			{ puuid: puuid }, // filter condition to find the document to update
			{ $set: { matchIds: newMatchIds } }, // update the matchIds field with the new array of match IDs
			{ new: true }, // return the updated document
			(error, doc) => {
				if (error) console.log(error);
				else console.log('Match document updated successfully');
			}
		);

		//League of Legends API - Rate limit 20 requests per second, 100 requests per 2 minutes for personal use

		//Queries the matchIds from MatchList and loop through and query matchIds from MatchDetails
		MatchList.find({}, function (err, matchLists) {
			if (err) {
				console.log(err);
			} else {
				matchLists.forEach(function (matchList) {
					matchList.matchIds.forEach(async function (matchId) {
						//console.log(matchId); array of matchIds

						//Query matchDetails using matchId
						// const matchDetail = await MatchDetails.findOne({ matchId: matchId });
						// if (matchDetail) return queriedSummoner... gameCreation...
						//else: matchStatusResponse API call, and write into the matchDetails collection, return data to client
						// console.log(matchDetail.gameCreation)

						const matchStatsResponse = await axios.get(
							`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`
						);
						console.log(matchStatsResponse.data['info']['gameCreation']);
					});
				});
			}
		});

		// // @desc Use matchId from matchIdResponse to retrieve details of each match
		// for (let i = 0; i < matchIdResponse.data.length; i++) {
		// 	// Use the match ID to retrieve details of the match
		// 	const matchStatsResponse = await axios.get(
		// 		`https://americas.api.riotgames.com/lol/match/v5/matches/${matchIdResponse.data[i]}`
		// 	);
		// 	//console.log(matchStatsResponse.data['info']['gameCreation']);
		// }

		// const matchDetails = new MatchDetail(matchInfo);
		// matchDetails.save((error, doc) => {
		// 	if (error) console.log(error);
		// 	else console.log('Match details saved successfully');
		// });

		return {
			name: queriedSummoner.name,
			profileIconId: queriedSummoner.profileIconId,
			queueType: queriedSummoner.queueType,
			rank: queriedSummoner.rank,
			tier: queriedSummoner.tier,
			wins: queriedSummoner.wins,
			losses: queriedSummoner.losses,
		};
		//}
	} catch (error) {
		console.error(error);
	}
}

module.exports = queryMatches;
