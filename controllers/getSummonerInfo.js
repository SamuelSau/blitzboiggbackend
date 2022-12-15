const Summoners = require('../models/Summoners')
const axios = require('axios');
const dotenv = require('dotenv').config();
const API_KEY = process.env.API_KEY;

// Use the axios.interceptors.request property to add an interceptor
axios.interceptors.request.use(function (config) {
	// Set the X-Riot-Token header in the config object
	config.headers['X-Riot-Token'] = API_KEY;
	config.headers['Content-Type'] = 'application/json';
	// Return the modified config object
	return config;
  });
  
const getSummonerInfo = async (summonerName) => {
	// Use the League of Legends API to retrieve player information
	
	// Use the League of Legends API to retrieve player information
	const summonerIdResponse = await axios.get(
	`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
  );
  
  // Use the summoner ID to retrieve player's stats
  const summmonerStatsResponse = await axios.get(
	`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerIdResponse.data.id}`
  );
	// Parse the response data to extract the player information
	const summonerData = summmonerStatsResponse.data[0];

	const summoner = {
		summonerId: summonerData.summonerId,
		name: summonerData.summonerName,
		tier: summonerData.tier,
		rank: summonerData.rank,
		wins: summonerData.wins,
		losses: summonerData.losses,
	};


    //query in database by summonerId
	const foundSummoner = await Summoners.findOne({ summonerId: summonerData.summonerId });

	if(!foundSummoner) {
		// Create a new player document using the player data
		const newSummoner = new Summoners(summoner);
		return newSummoner.save((error, doc) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Player document saved successfully.');
				//Display that new user has been added to database
			}
		});
	}
	else {
		return {
			name: foundSummoner.name,
			tier: foundSummoner.tier,
			rank: foundSummoner.rank,
			wins: foundSummoner.wins,
			losses: foundSummoner.losses
		  };
	}
	
};

module.exports = getSummonerInfo