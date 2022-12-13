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
app.get('/:summonerName', async (req, res) => {
	const summonerName = req.params.summonerName;

	await axios
		.get(
			`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
			{
				headers: {
					'X-Riot-Token': API_KEY,
				},
			}
		)
		.then((response) => {
			res.json(response.data);
		})
		.catch((error) => {
			res.status(500).send(error);
		});
});

//Returns rank, summonerName, wins/losses
app.get('/entries/:summonerid', async (req, res) => {
	const summonerid = req.params.summonerid;
	axios
		.get(
			`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid}`,
			{
				headers: {
					Origin: 'https://developer.riotgames.com',
					'X-Riot-Token': API_KEY,
				},
			}
		)
		.then((response) => {
			res.json(response.data);
		})
		.catch((error) => {
			res.status(500).send(error);
		});
});

//Returns upto 20 of the recent summoner's matches using puuid
app.get('/match-history/:puuid', async (req, res) => {
	const puuid = req.params.puuid
	await axios
		.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
			{
				headers: {
					'X-Riot-Token': API_KEY,
				},
			}
		)
		.then((response) => {
			res.json(response.data);
		})
		.catch((error) => {
			res.status(500).send(error);
		});
});

// Return data from specific match history 
app.get('/match-history/:summonerid/:matchid', async (req, res) => {
	
	const matchid = req.params.matchid;

	await axios
		.get(
			`https://americas.api.riotgames.com/lol/match/v5/matches/${matchid}`,
			{
				headers: {
					'X-Riot-Token': API_KEY,
				},
			}
		)
		.then((response) => {
			res.json(response.data);
		})
		.catch((error) => {
			res.status(500).send(error);
		});
});

app.listen(PORT, () => {
	console.log(`Serving running on port ${PORT}`);
});