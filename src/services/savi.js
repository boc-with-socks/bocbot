const axios = require('axios')

const qList = [
    'Dua Lipa',
    'Lana del Rey',
    'Riverdale',
    'Taylor Swift',
    'Bebe Rexha',
    'Selena Gomez'
]

module.exports = class Savi
{
    constructor(message) {

        this.message = message

        this.endpoint = "https://www.googleapis.com/youtube/v3/search"
        this.q = this.loadQ()
        
        this.load().then(data => {

            var video = this.parseData(data.data)
            this.message.channel.send(`https://www.youtube.com/watch?v=${video}`)

        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint, {
            params: {
                key: process.env.YT_KEY,
                part: 'snippet',
                maxResults: 25,
                q: this.q
            }
        })
    }

    loadQ() {

        return qList[Math.floor(Math.random()*qList.length)]
    }

    parseData(data) {

        return data.items[Math.floor(Math.random()*data.items.length)].id.videoId
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}