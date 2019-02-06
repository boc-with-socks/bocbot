const axios = require('axios')

module.exports = class Gag
{
    constructor(message) {

        this.message = message
        this.endpoint = "https://9gag.com/random"
        this.load().then(data => {

            var post = this.parseData(data)

            this.sendMessage(post)

        }).catch(err => {

            this.sendMessage(`damkus fix pls -> err: ${err.response.data}`)
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