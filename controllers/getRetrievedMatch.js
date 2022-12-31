const getRetrievedMatch = async (
	queriedSummoner,
	queriedMatchDetails,
	matchDetailsArray,
	newMatchIds
) => {
	for (let i = 0; i < newMatchIds.length; i++) {
		matchDetailsArray.push(queriedMatchDetails);
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
