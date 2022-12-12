const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const dotenv = require('dotenv').config();

const apiKey = process.env.API_KEY;
// define a route that fetches data from the League of Legends API
app.get('/summoner/:summonerName', async (req, res) => {
	const summonerName = req.params.summonerName;
	axios
		.get(
			`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
			{
				headers: {
					"Origin": 'https://developer.riotgames.com',
					'X-Riot-Token': apiKey,
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

app.get('/entries/:summonerid', async (req, res) => {
	const summonerid = req.params.summonerid;
	axios
		.get(
			`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerid}`,
			{
				headers: {
					"Origin": 'https://developer.riotgames.com',
					'X-Riot-Token': apiKey,
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
