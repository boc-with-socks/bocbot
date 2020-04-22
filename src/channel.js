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
const Wow = require('./services/wow.js')
const Owo = require('./services/owo.js')
const Virus = require('./services/virus.js')
const Log = require('./services/log.js')

var damkusCounter = 1
var lolCounter = 1
var messageCounter = 1
var commandList = "trivia, stop, talk, categories, lol, haha, gay, xd, uhbijnokn, dota, merc, bible, cat, damkus, job, savi, boc, affly, misioh, tictac, help"

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

            if (damkusCounter%45 == 0) {

                this.sendMessage(`shut the fuck up damkus`)
            }
            damkusCounter++
        }

        if (message.content.includes('lol')) {

            if (lolCounter%7 == 0) {

                this.sendMessage(`stop saying lol retard <@${message.author.id}>`)
            }
            lolCounter++
        }

        if (message.channel.id == 382303724661637123) {

            if (messageCounter%100 == 0) {

                if (Math.random() < 0.5) {
                    
                    if (message.content.length > 15) {

                       new Owo(message)
                       messageCounter++
                    }
                } else {

                    var rating = Math.floor(Math.random() * 100) / 10
                    if (rating < 5 && rating >= 2) {

                        this.sendMessage(`Bad post nigga, I rate it ${rating}/10`)
                    }
                    if (rating > 0 && rating < 2) {

                        this.sendMessage(`That's a really shit post, I rate it ${rating}/10 (you're dumb btw)`)   
                    }
                    if (rating == 0) {

                        this.sendMessage(`That's the worst post I've ever seen, I give it an unironic ${rating}/10`)
                    }
                    if (rating >= 5 && rating < 7) {

                        this.sendMessage(`Alright, decent shitpost. I rate it ${rating}/10`)
                    }
                    if (rating >= 7 && rating < 9) {

                        this.sendMessage(`Nice post gamer, keep it up. That's a ${rating}/10`)
                    }
                    if (rating >= 9 && rating <= 10) {

                        this.sendMessage(`Now that's what I call a great post, giving you a ${rating}/10. Hope damkus liked it too (slurp)`)
                    }
                    if (rating < 0 || rating > 10) {

                        this.sendMessage(`this post souldn't exist`)
                    }
                    messageCounter++
                }

            } else {

                messageCounter++
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
                this.sendMessage("stop using this command")
                // new Stats(this._message)
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
                this.sendMessage('current list of jobless nerds:\n-mercury (not anymore)\n-savi\n-porro\n-fip\n-savisaar\n-toomas\n-noelle')
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

            case 21:
                new Wow(this._message)
                break

            case 22:
                new Virus(this._message, message.getOptions())
                break

            case 23:
                this.sendMessage(`${message.getAuthor().username} just rolled a ${~~(Math.random() * 100)}`)
                break

            case 24:
                new Log(this._message, message.getOptions())
                break

            case 99:
                this.sendMessage(`commands: ${commandList}`)
                break

            default:
                break
        }   
    }

    sendMessage(content) {

        this._message.channel.send(content)
    }
}
