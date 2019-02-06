const axios = require('axios')

module.exports = class Reddit
{
    constructor(message) {

        this.message = message
        this.endpoint = "https://www.reddit.com/r/funny/top.json?t=day"
        this.load().then(data => {

            var posts = this.parseData(data.data.data.children)
            var post = this.pickPost(posts)

            this.sendMessage(post)

        }).catch(err => {

            this.sendMessage(`damkus fix pls: ${err.response.data}`)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    parseData(data) {

        var posts = []

        data.forEach(item => {

            if (!item.data.is_video) {

                posts.push(item.data.url)
            }
        })
        return posts
    }

    pickPost(posts) {

        var idx = Math.floor(Math.random() * posts.length)
        return posts[idx]
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}