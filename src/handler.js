const Channel = require('./channel.js')
const Message = require('./message.js')

module.exports = class Handler
{
    constructor() {

        this.channels = []
    }

    process(message) {

        var channelIndex = this.getChannelIndex(message)

        this.channels[channelIndex].process(new Message(message))
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
