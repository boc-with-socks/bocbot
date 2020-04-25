const axios = require('axios')
const {RichEmbed} = require('discord.js')

const _reactSignup = "\uD83D\uDE4B"
//\uD83D\uDE4B
//\u2B06
const _hangmanSteps = [
'c  - - - -\n   |/    |\n   |\n   |\n   |\n-----',
'c  - - - -\n   |/    |\n   |     ( )\n   |\n   |\n-----',
'c  - - - -\n   |/    |\n   |     ( )\n    |     |\n   |\n-----',
'c  - - - -\n   |/    |\n   |     ( )\n   |   / | \\\n   |\n-----',
'c  - - - -\n   |/    |\n   |     ( )\n   |   / | \\\n   |    / \\\n-----'
]

module.exports = class Hangman
{
    constructor(message, author) {

        this.message = message
        this.author = author
        this._stopping = false
        this.wordToGuess = null
        this.playerList = []
        this.playerTurnIdx = 0
        this.guesses = []
        this.wordToShow = ''
        this.playerToPlay = null
        this.isWaitingForAction = true
        this.hasTried = false
        this.isTrySuccess = false
        this.isLoading = true
        this.signupMessage = null
        this.embedToSend = null
        this.mainMessage = null
        this.embedMessage = null

        this.askWordToGuess()
        this.beginSignup()
    }

    askWordToGuess() {

        this.author.send('Pick a word (1 - 15 letters, no tricky stuff)')
    }

    process(message) {

        if (this.wordToGuess == null || this.hasTried || this.isLoading || this.playerList.length < 1) {
            return 0
        } else if (message.author.id != this.playerList[this.playerTurnIdx].id) {
            return 0
        }
        
        if (message.content.length > 1) {

            this.guessWord(message.content)

        } else if (message.content.length == 1) {

            this.guessLetter(message.content)
        }
    }

    guessWord(str) {

        if (this.wordToGuess == str) {

            this.win()
        } else {

            this.lose()
            this.isTrySuccess = false
        }

        this.hasTried = true
        this.guesses.push(str)
    }

    guessLetter(str) {

        if (this.wordToGuess.includes(str)) {

            this.isTrySuccess = true
            this.updateWordToShow(str)
        } else {

            this.isTrySuccess = false
        }

        this.hasTried = true
        this.guesses.push(str)
    }

    processEvent(message, user) {

        if (this._stopping == true/* || user == this.author*/) return null
        if (message._emoji.name == _reactSignup) {

            if (this.playerList.indexOf(user) == -1) {

                this.playerList.push(user)
            }
        }
    }

    processDM(message) {

        var author = message.author

        if (this.wordToGuess == null && author.id == this.author.id) {

            if (message.content.length > 1 && message.content.length <= 15) { // need more restrictions
                
                this.wordToGuess = message.content.toLowerCase()
            } else {

                author.send('Invalid word')
            }
        } else {


        }
    }

    gameLoop() {

        var hangStep = 0
        var game = setInterval(() => {
        
            if (!this.hasTried) {

                this.askPlayer()
            } else 
            if (this.hasTried) {
                
                if (!this.isTrySuccess) hangStep = Math.min(hangStep + 1, _hangmanSteps.length)
                this.updateEmbed(hangStep)
                this.embedMessage.edit(this.embedToSend)

                this.hasTried = false
                this.pickPlayer()
            }

            this.checkEnd(hangStep)
            
            if (this._stopping) {

                clearInterval(game)
            }
        }, 2000)
    }

    start() {

        this.initWordToShow()
        this.playerList.sort(() => Math.random() - 0.5)
        this.pickPlayer()
        this.updateEmbed(0)

        this.sendMessage(this.embedToSend).then((embed) => {

            this.embedMessage = embed
            this.sendMessage(`Game is starting...`).then((msg) => {

                this.mainMessage = msg
                this.gameLoop()
            })
        })
    }

    updateWordToShow(l) {

        var len = this.wordToGuess.length
        var updatedWord = this.wordToShow

        for (var i = 0; i < len; i++) {
         
            if (this.wordToGuess.charAt(i) == l) {

                updatedWord = updatedWord.substr(0, i) + l + updatedWord.substr(i + 1, len)
            }
        }

        this.wordToShow = updatedWord
    }

    prepareWordToShow() {

        return this.wordToShow.replace(/[_]/gi, '\\_')
    }

    initWordToShow() {

        this.wordToShow = this.wordToGuess.replace(/[a-z0-9]/gi, '_')
    }

    updateEmbed(i) {

        this.embedToSend = new RichEmbed()
                .setAuthor('Brought to you by Bocbot Inc.', 'https://www.redditstatic.com/avatars/avatar_default_09_FF585B.png', 'https://github.com/boc-with-socks/bocbot')
                .setColor(0xff0000)
                .setTitle('Hangman')
                .addField(_hangmanSteps[i], `guesses: ${this.guesses}`)
                .addField(`Word: (${this.wordToGuess.length} letters)`, this.prepareWordToShow())
    }

    pickPlayer() {

        this.playerTurnIdx = (this.playerTurnIdx + 1) % this.playerList.length
    }

    askPlayer() {

        this.mainMessage.edit(`It's ${this.playerList[this.playerTurnIdx]}'s turn'`)
        this.isLoading = false
    }

    beginSignup() {

        var i = 30
        this.sendMessage(`Hangman is initiating, register by clicking emoji... ${i}s remaining`).then((msg) => {

            this.signupMessage = msg
            this.signupMessage.react(_reactSignup)
            
            var signup = setInterval(() => {

                i -= 2
                this.signupMessage.edit(`Hangman is initiating, register by clicking emoji... ${i}s remaining`)

                if(i == 0) {

                    this.endSignup()
                    clearInterval(signup)
                }
            }, 2000)
            
        })

    }

    endSignup() {

        if (this.wordToGuess == null) {
            
            this.signupMessage.edit(`Game will not start, <@${this.author.id}> did not not pick a word`)
            this._stopping = true
        } else if (this.playerList.length < 1) {

            this.signupMessage.edit(`Game will not start, not enough gamers`)
            this._stopping = true
        } else {

            this.signupMessage.edit(`Signup over, registered: ${this.playerList}`)
            this.start()
        }
    }

    win() {

        this.sendMessage(`You won`)
        this.wordToShow = this.wordToGuess
        this._stopping = true
    }

    lose() {

        this.sendMessage(`You lost`)
        this.wordToShow = this.wordToGuess
        this._stopping = true
    }

    checkEnd(step) {

        if (step >= _hangmanSteps.length) {

            this.lose()
        } else
        if (step < _hangmanSteps.length && !this.wordToShow.includes('_')) {

            this.win()
        } else return 0
    }

    isRunning() {

        return !this._stopping
    }

    sendMessage(content) {

        return this.message.channel.send(content)
    }
}