const Trivia = require('./trivia.js')

module.exports = class Channel
{

    constructor(message) {

        this._id = message.channel.id
        this._message = message
        this._game = null
    }

    getId() {
        return this._id
    }

    process(message) {

        var cmd = message.getCommand()

        if (cmd) {

            this.processCommand(cmd)
        }
    }

    processCommand(cmd) {

        switch (cmd) {

            case 1:
                //todo start trivia
                this.sendMessage("starting trivia")
                break
            case 2:
                //todo stop trivia
                this.sendMessage("stopping trivia")
                break
            default:
                break
        }   
    }

    sendMessage(content) {

        this._message.channel.send(content)
    }
}