const axios = require('axios')

module.exports = class Cat
{
    constructor(message) {

        this.message = message

        this.endpoint = "https://catfact.ninja/fact"
        
        this.load().then(data => {

            var cat = data.data.fact

            this.sendMessage(cat)

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