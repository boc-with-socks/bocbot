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
            return true
        }

        this.processText(message.getMessage())
    }

    processText(message) {

        if (this._game != null) {

            this._game.process(message)
        }
    }

    processCommand(cmd) {

        switch (cmd) {

            case 1:

                this.sendMessage("Trivia starting")
                this._game = new Trivia(this._message, "")
                this._game.start()
                break

            case 2:

                if (this._game != null) {
                    
                    this._game.stop()
                    this.sendMessage("Trivia stopping after the current question")
                }
                break

            default:
                break
        }   
    }

    sendMessage(content) {

        this._message.channel.send(content)
    }
}