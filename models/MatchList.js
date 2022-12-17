const mongoose = require('mongoose');

const MatchList = mongoose.model('matchList', {
	puuid: String,
	matchIds: [String],
    
});

module.exports = MatchList