const MatchList = require('../models/MatchList');
const MatchDetails = require('../models/MatchDetails');
const getParticipantId = require('../controllers/getParticipantId')
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
						const matchDetail = await MatchDetails.findOne({
							matchId: matchId,
						});

						//If that matchId exist in our database
						if (matchDetail) {
							return {
								name: queriedSummoner.name,
								profileIconId: queriedSummoner.profileIconId,
								queueType: queriedSummoner.queueType,
								rank: queriedSummoner.rank,
								tier: queriedSummoner.tier,
								wins: queriedSummoner.wins,
								losses: queriedSummoner.losses,
								matchId: matchDetail.matchId,
								gameCreation: matchDetail.gameCreation,
								gameDuration: matchDetail.gameDuration,
								gameMode: matchDetail.gameMode,
								gameType: matchDetail.gameType,
								assists: matchDetail.assists,
								kills: matchDetail.kills,
								role: matchDetail.role,
								champLevel: matchDetail.champLevel,
								championId: matchDetail.championId,
								championName: matchDetail.championNam,
								deaths: matchDetail.deaths,
								item0: matchDetail.item0,
								item1: matchDetail.item1,
								item2: matchDetail.item2,
								item3: matchDetail.item3,
								item4: matchDetail.item4,
								item5: matchDetail.item5,
								item6: matchDetail.item6,
								summoner1Casts: matchDetail.summoner1Casts,
								summoner1Id: matchDetail.summoner1Id,
								summoner2Casts: matchDetail.summoner2Casts,
								summoner2Id: matchDetail.summoner2Id,
								summonerId: matchDetail.summonerId,
								summonerLevel: matchDetail.summonerLevel,
								summonerName: matchDetail.summonerName,
								totalDamageDealtToChampions: matchDetail.totalDamageDealtToChampions,
								teamId: matchDetail.teamId,
								totalMinionsKilled: matchDetail.totalMinionsKilled,
								killParticipation: matchDetail.killParticipation,
								kda: matchDetail.kda,
							};
						}
						//else: matchStatusResponse API call, and write into the matchDetails collection, return data to client
						// console.log(matchDetail.gameCreation)

						const matchStatsResponse = await axios.get(
							`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`
						);
						
						console.log(matchStatsResponse.data['metadata']['participants'])
						
						const participantIndex = await getParticipantId(matchStatsResponse.data['metadata']['participants'], puuid) 
						console.log(matchStatsResponse.data['info']['participants'][participantIndex]['assists'],)
						
						const matchInformation = { 
							matchId: matchStatsResponse.matchId,
							gameCreation: matchStatsResponse.data['info']['gameCreation'],
							gameDuration: matchStatsResponse.data['info']['gameDuration'],
							gameMode: matchStatsResponse.data['info']['gameMode'],
							gameType: matchStatsResponse.data['info']['gameType'],
							assists:
								matchStatsResponse.data['info']['participants'][participantIndex]['assists'],
							kills: matchDetail.kills,
							role: matchDetail.role,
							champLevel: matchDetail.champLevel,
							championId: matchDetail.championId,
							championName: matchDetail.championNam,
							deaths: matchDetail.deaths,
							item0: matchDetail.item0,
							item1: matchDetail.item1,
							item2: matchDetail.item2,
							item3: matchDetail.item3,
							item4: matchDetail.item4,
							item5: matchDetail.item5,
							item6: matchDetail.item6,
							summoner1Casts: matchDetail.summoner1Casts,
							summoner1Id: matchDetail.summoner1Id,
							summoner2Casts: matchDetail.summoner2Casts,
							summoner2Id: matchDetail.summoner2Id,
							summonerId: matchDetail.summonerId,
							summonerLevel: matchDetail.summonerLevel,
							summonerName: matchDetail.summonerName,
							totalDamageDealtToChampions:
								matchDetail.totalDamageDealtToChampions,
							teamId: matchDetail.teamId,
							totalMinionsKilled: matchDetail.totalMinionsKilled,
							killParticipation: matchDetail.killParticipation,
							kda: matchDetail.kda,
						};
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
