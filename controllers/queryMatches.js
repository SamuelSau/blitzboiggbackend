const MatchList = require('../models/MatchList');
const MatchDetails = require('../models/MatchDetails');
const getTeamId = require('./getTeamId');
const getParticipantId = require('./getParticipantId');
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
								championName: matchDetail.championName,
								deaths: matchDetail.deaths,
								item0: matchDetail.item0,
								item1: matchDetail.item1,
								item2: matchDetail.item2,
								item3: matchDetail.item3,
								item4: matchDetail.item4,
								item5: matchDetail.item5,
								item6: matchDetail.item6,
								summoner1Id: matchDetail.summoner1Id,
								summoner2Id: matchDetail.summoner2Id,
								summonerId: matchDetail.summonerId,
								summonerLevel: matchDetail.summonerLevel,
								summonerName: matchDetail.summonerName,
								totalDamageDealtToChampions:
									matchDetail.totalDamageDealtToChampions,
								teamId: matchDetail.teamId,
								teamPosition: matchDetail.teamPosition,
								totalMinionsKilled: matchDetail.totalMinionsKilled,
								killParticipation: matchDetail.killParticipation,
								kda: matchDetail.kda,
								primaryRune: matchDetail.primaryRune,
								secondaryRune: matchDetail.secondaryRune,
								baronKills: matchDetail.baronKills,
								dragonKills: matchDetail.dragonKills,
								riftHeraldKills: matchDetail.riftHeraldKills,
								inhibitorKills: matchDetail.inhibitorKills,
								towerKills: matchDetail.towerKills,
								win: matchDetail.win,
							};
						}
						//else: matchStatusResponse API call, and write into the matchDetails collection, return data to client
						// console.log(matchDetail.gameCreation)

						const matchStatsResponse = await axios.get(
							`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`
						);

						//Retrieves participantId (which is a puuid) from a list of puuids to fetch info in participantsDTO
						const puuidsOfParticipates =
							matchStatsResponse.data['metadata']['participants'];
						const participantIndex = await getParticipantId(
							puuidsOfParticipates,
							puuid
						);

						//Return index from respective teamId to fetch info in teamsDTO
						const teamId =
							matchStatsResponse.data['info']['participants'][participantIndex][
								'teamId'
							];
						//console.log(teamId) //200
						const teamIndex = await getTeamId(teamId);
						//console.log(teamIndex) //1
						//console.log(matchStatsResponse.data['info']['participants'][participantIndex]['assists'])
						//console.log( matchStatsResponse.data['info']['participants'][participantIndex]['perks'])

						// console.log(
						// 	matchStatsResponse.data['info']['participants'][participantIndex][
						// 		'summoner1Id'
						// 	]
						// ); //flash

						// console.log(
						// 	matchStatsResponse.data['info']['participants'][participantIndex][
						// 		'summoner2Id'
						// 	]
						// ); //ignite

						//primary rune
						//console.log(matchStatsResponse.data['info']['participants'][participantIndex]['perks']['styles'][0]['style'])
						//secondary rune
						//console.log(matchStatsResponse.data['info']['participants'][participantIndex]['perks']['styles'][1]['style'])

						//console.log(matchStatsResponse.data['info']['participants'][participantIndex]['perks']['styles'][0]['selections'])

						//console.log(matchStatsResponse.data['info']['teams'][teamIndex]['objectives']['dragon']['kills']) = 3
						// console.log(matchStatsResponse.data['info']['participants'][
						// 	participantIndex
						// ]['win'])

						const matchInformation = {
							matchId: matchStatsResponse.matchId,
							gameCreation: matchStatsResponse.data['info']['gameCreation'],
							gameDuration: matchStatsResponse.data['info']['gameDuration'],
							gameMode: matchStatsResponse.data['info']['gameMode'],
							gameType: matchStatsResponse.data['info']['gameType'],
							assists:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['assists'],
							kills:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['kills'],
							role: matchStatsResponse.data['info']['participants'][
								participantIndex
							]['role'],
							champLevel:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['champLevel'],
							championId:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['championId'],
							championName:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['championName'],
							deaths:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['deaths'],
							item0:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item0'],
							item1:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item1'],
							item2:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item2'],
							item3:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item3'],
							item4:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item4'],
							item5:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item5'],
							item6:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['item6'],
							summoner1Id:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['summoner1Id'],
							summoner2Id:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['summoner2Id'],
							summonerId:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['summonerId'],
							summonerLevel:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['summonerLevel'],
							summonerName:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['summonerName'],
							totalDamageDealtToChampions:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['totalDamageDealtToChampions'],
							teamId:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['teamId'],
							totalMinionsKilled:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['totalMinionsKilled'],
							killParticipation:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['killParticipation'],
							kda: matchStatsResponse.data['info']['participants'][
								participantIndex
							]['kda'],
							teamPosition:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['teamPosition'],
							primaryRune:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['perks']['styles'][0]['style'],
							secondaryRune:
								matchStatsResponse.data['info']['participants'][
									participantIndex
								]['perks']['styles'][1]['style'],
							baronKills:
								matchStatsResponse.data['info']['teams'][teamIndex][
									'objectives'
								]['baron']['kills'],
							dragonKills:
								matchStatsResponse.data['info']['teams'][teamIndex][
									'objectives'
								]['dragon']['kills'],
							riftHeraldKills:
								matchStatsResponse.data['info']['teams'][teamIndex][
									'objectives'
								]['riftHerald']['kills'],
							inhibitorKills:
								matchStatsResponse.data['info']['teams'][teamIndex][
									'objectives'
								]['inhibitor']['kills'],
							towerKills:
								matchStatsResponse.data['info']['teams'][teamIndex][
									'objectives'
								]['tower']['kills'],
							win: matchStatsResponse.data['info']['participants'][
								participantIndex
							]['win'],
						};

						const matchData = new MatchDetails(matchInformation);
						matchData.save((error, doc) => {
							if (error) console.log(error);
							else console.log('MatchDetails document saved successfully');
						});
					});
				});
			}
		});

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
