const axios = require('axios')


const STEAM_IDS = {
    // Discord ID - Steam ID
    // Merc
    599282998612983818: 76561198009246871
}

module.exports = class Aoe 
{
    constructor(message, author = null, options = []) {

        this.message = message
        this.authorId = author.id

        // if (this.checkOptions(options) == 0) return 0

        console.log(message)
        // this.endpoint = `https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=${STEAM_IDS[this.authorId]}`
        this.endpoint = `https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=76561198009246871`

        this.load().then(data => {

            console.log(data.data)

        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    parseData(data) {

        return data.request.res.responseUrl
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}