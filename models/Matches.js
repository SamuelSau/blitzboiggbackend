const mongoose = require('mongoose');

const Matches = mongoose.model('matches', {
	matchId: {
		type: Number,
		required: true, 
		default: 0,
	}
    
});

module.exports = Matches