const express = require('express');
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv').config();
const cors = require('cors');
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_URI = process.env.CONNECTION_URI;
const app = express();
const mongoose = require('mongoose')
const getSummonerInfo = require('./controllers/getSummonerInfo')

app.use(cors());
//Routes

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

// Set up routes for handling requests
app.get('/summoners/:summonerName', async (req, res) => {
	const summonerName = req.params.summonerName;
	try {
		// Use the getSummonerInfo method to retrieve the player's information
		const summonerInfo = await getSummonerInfo(summonerName);
		res.send(summonerInfo);
		res.status(200)

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
	
});

app.get('/performance/:id', (req, res) => {
	const performanceId = req.params.id;
	database
		.getPerformance(performanceId)
		.then((performance) =>
			res.send(performance).catch((err) => res.status(500).send(err))
		);
	
});

/*	Connect to MongoDB
	Set up connection using Mongoose
*/
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


app.listen(PORT, () => {
	console.log(`Serving running on port ${PORT}`);
});
