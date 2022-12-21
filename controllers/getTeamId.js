const getTeamId = async (teamId) => {
    if(teamId === 100){
        return 0
    }
    else if (teamId === 200){
        return 1
    }
}
module.exports = getTeamId;