const mongoose = require('mongoose');

const MatchDetails = mongoose.model('matchdetails', {
	gameCreation: Number,
	gameDuration: Number,
	gameMode: String,
	gameType: String,
	assists: Number,
	kills: Number,
	role: String,
	champLevel: Number,
	championId: Number,
	championName: String,
	deaths: Number,
	item0: Number,
	item1: Number,
	item2: Number,
	item3: Number,
	item4: Number,
	item5: Number,
	item6: Number,
	summoner1Casts: Number,
	summoner1Id: Number,
	summoner2Casts: Number,
	summoner2Id: Number,
	summonerId: String,
	summonerLevel: Number,
	summonerName: String,
	totalDamageDealtToChampions: Number,
	teamId: Number,
	totalMinionsKilled: Number,
	killParticipation: Number,
	kda: Number,
    styles: [
        {
            description: String,
            selections: [
                {
                    perk: Number,
                    var1: Number,
                    var2: Number,
                    var3: Number
                }
            ],
            style: Number
        }
    ]
});

module.exports = MatchDetails;
