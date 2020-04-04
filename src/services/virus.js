const axios = require('axios')

module.exports = class Virus
{
    constructor(message) {

        this.message = message

        this.endpoint = "https://api.thevirustracker.com/free-api?countryTotal=US"
        
        this.load().then(data => {


            this.run(data.data)
        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}