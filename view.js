const displayPlayer = (player) => {
    console.log(`Player: ${player.name} - Level ${player.level}`);
    console.log(`Wins: ${player.wins} - Losses: ${player.losses}`);
    };
    
    const displayMatch = (match) => {
    console.log(`Match: ${match.id} - ${match.mode} ${match.type} on ${match.map}`);
    console.log(`Duration: ${match.duration} seconds`);
    };
    
    const displayPerformance = (performance) => {
    console.log(`Performance: ${performance.id}`);
    console.log(`Champion: ${performance.champion} - Kills: ${performance.kills} - Deaths: ${performance.deaths} - Assists: ${performance.assists}`);
    };
    
    module.exports = {
    displayPlayer,
    displayMatch,
    displayPerformance,
    };