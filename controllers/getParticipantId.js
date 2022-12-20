const getParticipantId = async (listOfParticipants, puuid) => {
    for(let i = 0; i < listOfParticipants.length; i++){ //length is dependent on how much we called from matchIdResponse
        //if puuid == a specific entry (which is the participantid)
        if (puuid === listOfParticipants[i]){
            return i //return the index so that we can access for that particular match data
        }
    }
}
module.exports = getParticipantId