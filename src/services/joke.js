const axios = require('axios')
const he = require('he')

module.exports = class Joke
{
    constructor(message) {

        this.message = message
        this.endpoint = "https://icanhazdadjoke.com/"
        this.load().then(data => {

            var joke = this.parseData(data.data)

            this.sendMessage(joke)

        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint, {headers: {'Accept': 'application/json'}})
    }

    parseData(data) {

        return he.decode(data.joke)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}