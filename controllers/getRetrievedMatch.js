const MatchDetails = require('../models/MatchDetails');

const getRetrievedMatch = async (
	queriedSummoner,
	matchDatabaseInformation,
	matchDetailsArray,
	newMatchIds
) => {
	for (let i = 0; i < newMatchIds.length; i++) {
		
		MatchDetails.find({}, function (err, docs) {
			if (err) return console.error(err);
			matchDetailsArray.push(matchDatabaseInformation)
		});
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
};
module.exports = getRetrievedMatch;
