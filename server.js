const express = require('express');
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
const API_KEY = process.env.API_KEY;

//Routes

//Returns summonerid, accountid, and puuid
// app.get('/summoners/:region/:summonerName', async (req, res) => {
// 	const summonerName = req.params.summonerName;
// 	const region = req.params.region;
// 	await axios
// 		.get(
// 			`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
// 			{
// 				headers: {
// 					'X-Riot-Token': API_KEY,
// 				},
// 			}
// 		)
// 		.then((response) => {
// 			const summonerId = response.data.id;
// 			const puuid = response.data.puuid;
// 			const accountid = response.data.accountId;
// 			res.json(`Summonerid: ${summonerId}, Puuid: ${puuid}, Accountid: ${accountid}`);
// 			//store the summonerid and puuid in a database, go retrieve it for the match endpoint dont respond with json with summonerid and puuid to client?
// 		})
// 		.catch((error) => {
// 			res.status(500).send(error);
// 		});
// });

// //Returns rank, summonerName, wins/losses using summonerid
// app.get('/entries/:summonerid', async (req, res) => {
// 	const summonerid = req.params.summonerid;
// 	axios
// 		.get(
// 			`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid}`,
// 			{
// 				headers: {
// 					Origin: 'https://developer.riotgames.com',
// 					'X-Riot-Token': API_KEY,
// 				},
// 			}
// 		)
// 		.then((response) => {
// 			res.json(response.data);

// 		})
// 		.catch((error) => {
// 			res.status(500).send(error);
// 		});
// });

// //Returns upto 20 of the recent summoner's matches using puuid
// app.get('/match-history/:puuid', async (req, res) => {
// 	const puuid = req.params.puuid
// 	await axios
// 		.get(
// 			`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
// 			{
// 				headers: {
// 					'X-Riot-Token': API_KEY,
// 				},
// 			}
// 		)
// 		.then((response) => {
// 			res.json(response.data);
// 		})
// 		.catch((error) => {
// 			res.status(500).send(error);
// 		});
// });

// // Return data from specific match history using matchid
// app.get('/match-history/:summonerid/:matchid', async (req, res) => {

// 	const matchid = req.params.matchid;

// 	await axios
// 		.get(
// 			`https://americas.api.riotgames.com/lol/match/v5/matches/${matchid}`,
// 			{
// 				headers: {
// 					'X-Riot-Token': API_KEY,
// 				},
// 			}
// 		)
// 		.then((response) => {
// 			res.json(response.data);
// 		})
// 		.catch((error) => {
// 			res.status(500).send(error);
// 		});
// });

// Require the database module
const database = require('./database');
const { displayPlayer, displayMatch, displayPerformance } = require('./view');

// Set up routes for handling requests
app.get('/players/:id', async (req, res) => {
	const playerId = req.params.id;
	try {
		// Use the getSummonerInfo method to retrieve the player information
		const player = await database.getSummonerInfo(playerId);
		res.send(player);
		res.statusCode(200)

	  } catch (err) {
		res.status(500).send(err);
		console.log(err)
	  }
	});

app.get('/matches/:id', (req, res) => {
	const matchId = req.params.id;
	// Use the getMatch method to retrieve the match information
	database
		.getMatch(matchId)
		.then((match) => res.send(match))
		.catch((err) => res.status(500).send(err));
	//displayMatch();
});

app.get('/performance/:id', (req, res) => {
	const performanceId = req.params.id;
	database
		.getPerformance(performanceId)
		.then((performance) =>
			res.send(performance).catch((err) => res.status(500).send(err))
		);
	//displayPerformance();
});

app.listen(PORT, () => {
	console.log(`Serving running on port ${PORT}`);
});
