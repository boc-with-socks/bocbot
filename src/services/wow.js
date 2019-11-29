const axios = require('axios')

module.exports = class Wow
{
    constructor(message) {

        this.message = message

        this.endpoint = "https://www.wowprogress.com/gearscore/?lfg=1&sortby=ts"
        
        this.load().then(data => {

            var wow = data.data

            this.sendMessage(`imagine playing wow on ${new Date()}`)

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