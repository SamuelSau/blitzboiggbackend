const getParticipantId = async (puuidsOfParticipates, puuid) => {
    for(let i = 0; i < puuidsOfParticipates.length; i++){ //length is dependent on how much we called from matchIdResponse
        //if puuid == a specific entry (which is the participantid)
        if (puuid === puuidsOfParticipates[i]){
            return i //return the index so that we can access for that particular match data
        }
    }
}
module.exports = getParticipantId