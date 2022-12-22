const MatchList = require('../models/MatchList');
const MatchDetails = require('../models/MatchDetails');
const getTeamId = require('./getTeamId');
const getParticipantId = require('./getParticipantId');
const axios = require('axios');
const mongoose = require('mongoose');

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
			{ puuid: puuid }, { $set: { matchIds: newMatchIds } }, { new: true }, 
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
			});
			//If matchIds are equal in matchList and matchDetail, then push data from match details to matchDetailsArray
			if (queriedMatchDetails && queriedMatchDetails['matchId'] === matchId) {
				matchDetailsArray.push(queriedMatchDetails);
			
			} 
			//If not, then make API calls and write into database 
			else {
				const matchStatsResponse = await axios.get( `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}` );

				//Retrieves participantId (which is a puuid) from a list of puuids to fetch info in participantsDTO
				const puuidsOfParticipates = matchStatsResponse.data['metadata']['participants'];
				const participantIndex = await getParticipantId( puuidsOfParticipates, puuid );

				//Return index from respective teamId to fetch info in teamsDTO
				const teamId = matchStatsResponse.data['info']['participants'][participantIndex][ 'teamId' ];
				const teamIndex = await getTeamId(teamId);

				const matchInformation = { matchId: matchStatsResponse.data['metadata']['matchId'],
					gameCreation: matchStatsResponse.data['info']['gameCreation'],
					gameDuration: matchStatsResponse.data['info']['gameDuration'],
					gameMode: matchStatsResponse.data['info']['gameMode'],
					gameType: matchStatsResponse.data['info']['gameType'],
					assists: matchStatsResponse.data['info']['participants'][participantIndex]['assists'],
					kills:matchStatsResponse.data['info']['participants'][participantIndex]['kills'],
					role: matchStatsResponse.data['info']['participants'][participantIndex]['role'],
					champLevel: matchStatsResponse.data['info']['participants'][participantIndex]['champLevel'],
					championId: matchStatsResponse.data['info']['participants'][participantIndex]['championId'],
					championName: matchStatsResponse.data['info']['participants'][participantIndex]['championName'],
					deaths: matchStatsResponse.data['info']['participants'][participantIndex]['deaths'],
					item0: matchStatsResponse.data['info']['participants'][participantIndex][ 'item0' ],
					item1: matchStatsResponse.data['info']['participants'][participantIndex][ 'item1' ],
					item2: matchStatsResponse.data['info']['participants'][participantIndex][ 'item2' ],
					item3: matchStatsResponse.data['info']['participants'][participantIndex][ 'item3' ],
					item4: matchStatsResponse.data['info']['participants'][participantIndex][ 'item4' ],
					item5: matchStatsResponse.data['info']['participants'][participantIndex][ 'item5' ],
					item6: matchStatsResponse.data['info']['participants'][participantIndex][ 'item6' ],
					summoner1Id: matchStatsResponse.data['info']['participants'][participantIndex][ 'summoner1Id' ],
					summoner2Id: matchStatsResponse.data['info']['participants'][participantIndex][ 'summoner2Id' ],
					summonerId: matchStatsResponse.data['info']['participants'][participantIndex][ 'summonerId' ],
					summonerLevel: matchStatsResponse.data['info']['participants'][participantIndex][ 'summonerLevel' ],
					summonerName: matchStatsResponse.data['info']['participants'][participantIndex][ 'summonerName' ],
					totalDamageDealtToChampions: matchStatsResponse.data['info']['participants'][participantIndex][ 'totalDamageDealtToChampions' ],
					teamId: matchStatsResponse.data['info']['participants'][participantIndex][ 'teamId' ],
					totalMinionsKilled: matchStatsResponse.data['info']['participants'][participantIndex][ 'totalMinionsKilled' ],
					killParticipation: matchStatsResponse.data['info']['participants'][participantIndex][ 'killParticipation' ],
					kda: matchStatsResponse.data['info']['participants'][ participantIndex ]['kda'],
					teamPosition: matchStatsResponse.data['info']['participants'][participantIndex][ 'teamPosition' ],
					primaryRune: matchStatsResponse.data['info']['participants'][participantIndex][ 'perks' ]['styles'][0]['style'],
					secondaryRune: matchStatsResponse.data['info']['participants'][participantIndex][ 'perks' ]['styles'][1]['style'],
					baronKills: matchStatsResponse.data['info']['teams'][teamIndex]['objectives'][ 'baron' ]['kills'],
					dragonKills: matchStatsResponse.data['info']['teams'][teamIndex]['objectives'][ 'dragon' ]['kills'],
					riftHeraldKills: matchStatsResponse.data['info']['teams'][teamIndex]['objectives'][ 'riftHerald' ]['kills'],
					inhibitorKills: matchStatsResponse.data['info']['teams'][teamIndex]['objectives'][ 'inhibitor' ]['kills'],
					towerKills: matchStatsResponse.data['info']['teams'][teamIndex]['objectives'][ 'tower' ]['kills'],
					win: matchStatsResponse.data['info']['participants'][ participantIndex ]['win'],
				};

				const matchData = new MatchDetails(matchInformation);
				matchData.save((error, doc) => {
					if (error) console.log(error);
					else console.log('MatchDetails document saved successfully');
				});
				matchDetailsArray.push(matchInformation);
			}
		}

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
