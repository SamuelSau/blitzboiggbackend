const axios = require('axios');
const mongodb = require('mongodb');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const API_KEY = process.env.API_KEY;
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_URI = process.env.CONNECTION_URI;

// Set up connection to MongoDB database using Mongoose
mongoose.connect(CONNECTION_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: DATABASE_NAME,
});

const db = mongoose.connection;

// Check for connection errors
db.on('error', (error) => {
	console.error(error);
});

// If the connection is successful, log a message
db.once('open', () => {
	console.log('Connected to the database successfully.');
});

//Defined Players model - be sure to move into models folder
// const Players = mongoose.model('players', {
// 	summonerId: String,
// 	name: String,
// 	tier: String,
// 	rank: String,
// 	wins: {
// 		type: Number,
// 		required: true,
// 		default: 0,
// 	},
// 	losses: {
// 		type: Number,
// 		required: true,
// 		default: 0,
// 	},
// });

// const getSummonerInfo = async (playerId) => {
// 	// Use the League of Legends API to retrieve player information
	
// 	const response = await axios.get(
// 		`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${playerId}`,
// 		{
// 			headers: {
// 				'X-Riot-Token': API_KEY,
// 			},
// 		}
// 	);
	
// 	// Parse the response data to extract the player information
// 	const playerData = response.data[0];

	// if(!playerData){
	// 	return {
	// 		response.statusCode = 404,
	// 		response.message = 'Summoner not found',
	// 		return response;
	// 	}
	// }

// 	const player = {
// 		summonerId: playerData.summonerId,
// 		name: playerData.summonerName,
// 		tier: playerData.tier,
// 		rank: playerData.rank,
// 		wins: playerData.wins,
// 		losses: playerData.losses,
// 	};

// 	const foundPlayer = await Summoners.findOne({ summonerId: playerData.summonerId });

// 	if(!foundPlayer) {
// 		// Create a new player document using the player data
// 		const newPlayer = new Players(player);
// 		return newPlayer.save((error, doc) => {
// 			if (error) {
// 				console.log(error);
// 			} else {
// 				console.log('Player document saved successfully.');
// 			}
// 		});
// 	}
// 	else {
// 		return foundPlayer
// 	}
	
// };

const getMatch = async (matchId) => {
	// Use the League of Legends API to retrieve match information
	const matchResponse = await axios.get(
		`https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}`,
		{
			headers: {
				'X-Riot-Token': API_URL,
			},
		}
	);

	//Parse the response data to extract the match information
	const matchData = matchResponse.data;
	const match = {
		id: matchData.id,
		duration: matchData.gameDuration,
		mode: matchData.gameMode,
		type: matchData.gameType,
		map: matchData.mapId,
	};
	await matches.insertOne(match);
	const matchDoc = await matches.findOne({ id: matchId });
	console.log(matchDoc);
};

const getPerformance = async (matchId, playerId) => {
	// Use the League of Legends API to retrieve performance information for the player in the specified match
	//const performanceId = `${playerId}-${matchId}`;
	const performanceResponse = await axios.get(
		`https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}/participants?summonerId=${playerId}`,
		{
			headers: {
				'X-Riot-Token': API_KEY,
			},
		}
	);

	// Parse the response data to extract the player's performance in the match
	const performanceData = performanceResponse.data[0];
	const performance = {
		id: performanceId,
		playerId: playerId,
		matchId: matchId,
		champion: performanceData.championId,
		kills: performanceData.stats.kills,
		deaths: performanceData.stats.deaths,
		assists: performanceData.stats.assists,
	};
	await performances.insertOne(performance);
	const performanceDoc = await performances.findOne({ id: performanceId });
	console.log(performanceDoc);
};

module.exports = { getSummonerInfo, getMatch, getPerformance };
