const express = require('express');
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv').config();
const cors = require('cors');
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_URI = process.env.CONNECTION_URI;
const app = express();
const mongoose = require('mongoose')
const getSummonerInfo = require('./controllers/getSummonerInfo')

//Middleware for JSON and urlencoded parsers
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Route
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
