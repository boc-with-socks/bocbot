const Channel = require('./channel.js')
const Message = require('./message.js')

module.exports = class Handler
{
    constructor() {

        this.channels = []
    }

    process(message) {

        if(message.author.bot == true) return 0
        
        if(message.channel.type == 'dm') {

            for (var i = 0; i < this.channels.length; i++) {

                this.channels[i].processDM(new Message(message))
            }
        } else {
            
            var channelIndex = this.getChannelIndex(message)

            this.channels[channelIndex].process(new Message(message))
        }

    }

    processEvent(message, user) {

        if (user.bot) return
        var channelIndex = this.getChannelIndex(message.message)

        this.channels[channelIndex].processEvent(message, user)
    }

    getChannelIndex(message) {

        var channelId = message.channel.id
        var channelIndex = null

        this.channels.forEach((channel, idx) => {

            if (channel.getId() == channelId) {

                channelIndex = idx
            }
        })

        if (channelIndex == null) {

            channelIndex = this.channels.push(new Channel(message)) - 1
        }

        return channelIndex
    }
}
