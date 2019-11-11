const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
        {id: 'message_id', title: 'message_id'},
        {id: 'user_id', title: 'user_id'},
        {id: 'username', title: 'username'},
        {id: 'date', title: 'date'},
        {id: 'message', title: 'message'}
    ]
})

module.exports = class Stats
{
    constructor(message) {
        
        this.message = message

        //this.load()
        //this.sendMessage("stats starting DONT TYPE BOC STATS AGAIN")
        //this.message.channel.startTyping()
        this.megaLoad()
        //this.load()
        //console.log(this.message)
        //this.test()
    }

    test() {

        this.message.channel.fetchMessages({limit: 10, before: 1532535550240})
            .then(msg => {
                msg.forEach(item => console.log(item.content))
            })
    }

    load(limit = 15, counter = 0, lastMessage = this.message.id, THE_SIZE = 0, THE_ARRAY = []) {

        var newLastMessage = lastMessage
        this.message.channel.fetchMessages({limit: 50, before: lastMessage})
            .then(messages => {
                messages.forEach(item => {

                    THE_SIZE++
                    newLastMessage = item.id
                    THE_ARRAY.push({

                        message_id: item.id,
                        user_id: item.author.id,
                        username: item.author.username,
                        date: item.createdTimestamp,
                        message: item.content
                    })
                })

                if (counter >= limit || newLastMessage == lastMessage) {

                    console.log(counter, limit, THE_SIZE)
                    throw new Error("oops")
                }

                if (counter < limit) {

                    this.load(limit, counter + 1, newLastMessage, THE_SIZE, THE_ARRAY)
                }
            })
            .catch(err => {
                this.sendMessage(`limit: ${limit}x50 (${limit*50}), counter: ${counter}, size: ${THE_SIZE}`)
                this.message.channel.stopTyping()
                csvWriter
                    .writeRecords(THE_ARRAY)
                    .then(()=> console.log('The CSV file was written successfully'))
            })
    }

    megaLoad(limit = 10000, counter = 0, lastMessage = this.message.id, THE_SIZE = 0, THE_ARRAY = []) {

        var newLastMessage = lastMessage
        this.message.channel.fetchMessages({limit: 50, before: lastMessage})
            .then(messages => {
                messages.forEach(item => {

                    THE_SIZE++
                    newLastMessage = item.id
                    THE_ARRAY.push({

                        message_id: item.id,
                        user_id: item.author.id,
                        username: item.author.username,
                        date: item.createdTimestamp,
                        message: item.content
                    })
                })

                if (counter >= limit || newLastMessage == lastMessage) {

                    console.log(counter, limit, THE_SIZE)
                    throw new Error("oops")
                }

                if (counter < limit) {

                    this.megaLoad(limit, counter + 1, newLastMessage, THE_SIZE, THE_ARRAY)
                }
            })
            .catch(err => {
                this.sendMessage(`limit: ${limit}x50 (${limit*50}), counter: ${counter}, size: ${THE_SIZE}`)
                //this.message.channel.stopTyping()
                csvWriter
                    .writeRecords(THE_ARRAY)
                    .then(()=> console.log('The CSV file was written successfully'))
            })
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}