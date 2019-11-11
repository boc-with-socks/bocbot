const axios = require('axios')

module.exports = class Bible 
{
    constructor(message, options = []) {

        this.message = message
        
        var passage = this.checkOptions(options)

        this.endpoint = `http://labs.bible.org/api/?passage=${passage}&type=json`

        this.load().then(data => {

            console.log(data.data)
            var verse = data.data
  
            this.run(verse[0])

        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    checkOptions(options) {

        if (options.length >= 1) {

            if (options[0] == 'votd') return 'votd'

            var parts = options[0].split('-')
            return `${parts[0]}+${parts[1]}`
        }

        return 'random'
    }

    run(verse) {

        var str = `"${verse.text}" - ${verse.bookname} ${verse.chapter}:${verse.verse}`

        this.sendMessage(str)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}