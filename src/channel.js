const Trivia = require('./services/trivia.js')
const Reddit = require('./services/reddit.js')
const Gag = require('./services/gag.js')
const Joke = require('./services/joke.js')
const Stats = require('./services/stats.js')
const Dota = require('./services/dota.js')
const Prayer = require('./services/prayer.js')
const Bible = require('./services/bible.js')
const Cat = require('./services/cat.js')
const Kanye = require('./services/kanye.js')
const Savi = require ('./services/savi.js')
const Chembl = require('./services/chembl.js')
const Maths = require('./services/math.js')
const Tictactoe = require('./services/tictactoe.js')

var damkusCounter = 0
var lolCounter = 0

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

    processEvent(message, user) {

        if (this._game != null && this._game.isRunning()) {

            this._game.processEvent(message, user)
        }
        return null
    }

    processText(message) {

        if (this._game != null && this._game.isRunning()) {

            this._game.process(message)
        }
        else {
            //console.log(message)
            //if (message.author.) 
        }

        if (message.author.id == 236797886543822848) {

            damkusCounter++
            if (damkusCounter%30 == 0) {

                this.sendMessage(`shut the fuck up damkus`)
            }
        }

        if (message.content.includes('lol')) {

            lolCounter++
            if (lolCounter%5 == 0) {

                this.sendMessage(`stop saying lol retard <@${message.author.id}>`)
            }
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
                    //this.sendMessage("Trivia stopping after the current question")
                    this.sendMessage("Game stopping")
                    this._game = null
                }
                break

            case 3:

                this.sendMessage("damkus sucks fuckign COcks :boomer:")
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

            case 9:
                new Stats(this._message)
                break

            case 10:
                new Dota(this._message, message.getOptions())
                break

            case 11:
                new Prayer(this._message)
                break

            case 12:
                new Bible(this._message, message.getOptions())
                break

            case 13:
                new Cat(this._message)
                break

            case 14:
                new Kanye(this._message)
                break

            case 15:
                this.sendMessage('current list of jobless nerds:\n-mercury\n-savi\n-porro\n-fip\n-savisaar\n-toomas\n-noelle')
                break

            case 16:
                new Savi(this._message)
                break

            case 17:
                this.sendMessage('slurp')
                break

            case 18:
                new Chembl(this._message)
                break

            case 19:

                if (this._game == null || !this._game.isRunning()) {

                    this._game = null
                    this._game = new Maths(this._message)
                }
                else {

                    this.sendMessage("Game already running")
                }
                break

            case 20:
                if (this._game == null || !this._game.isRunning()) {

                    this._game = null
                    this._game = new Tictactoe(this._message, message.getMessage())
                }
                else {

                    this.sendMessage("Game already running")
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
