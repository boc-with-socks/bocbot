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

        if (message.getCommand()) {


            this.processCommand(message)
            return true
        }


        this.processText(message.getMessage())
    }

    processText(message) {

        if (this._game != null) {

            this._game.process(message)
        }
        else {
            //console.log(message)
            //if (message.author.) 
        }
    }

    processCommand(message) {

        switch (message.getCommand()) {

            case 1:

                this.sendMessage("Trivia starting")
                this._game = new Trivia(this._message, "", message.getOptions())
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