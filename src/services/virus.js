const axios = require('axios')

module.exports = class Virus
{
    constructor(message) {

        this.message = message

        this.endpoint = ""
        
        this.load().then(data => {


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