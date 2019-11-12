const axios = require('axios')

module.exports = class Kanye
{
    constructor(message) {

        this.message = message

        this.endpoint = "https://api.kanye.rest/"
        
        this.load().then(data => {

            var quote = data.data.quote

            this.sendMessage(`"${quote}" - Kanye W.`)

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