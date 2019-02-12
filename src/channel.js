const Trivia = require('./services/trivia.js')
const Reddit = require('./services/reddit.js')
const Gag = require('./services/gag.js')
const Joke = require('./services/joke.js')

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

        if (this._game != null && this._game.isRunning()) {

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

                if (this._game == null || !this._game.isRunning()) {

                    this.sendMessage("Trivia starting")
                    this._game = null
                    this._game = new Trivia(this._message, "", message.getOptions())
                    this._game.start()
                }
                else {

                    this.sendMessage("Game already running")
                }
                break

            case 2:

                if (this._game != null) {
                    
                    this._game.stop()
                    this.sendMessage("Trivia stopping after the current question")
                    this._game = null
                }
                break

            case 3:

                this.sendMessage("Funny homoerotic message")
                break

            case 4:

                this.sendMessage("http://damkus.xyz/categories.html")
                break

            case 5:
            
                new Reddit(this._message)
                break

            case 6:
            
                new Gag(this._message)
                break
		
    	    case 7:

        		this.sendMessage("@boc#2906 gay if read")
        		break

            case 8:

                new Joke(this._message)
                break

            default:
                break
        }   
    }

    sendMessage(content) {

        this._message.channel.send(content)
    }
}
