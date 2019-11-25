const axios = require('axios')

module.exports = class Math
{
    constructor(message) {

        this._answered = false
        this._questionEnded = false
        this._stopping = false

        this.message = message
        this.endpoint = "https://studycounts.com/api/v1/algebra/linear-equations.json?difficulty=intermediate"
        this.load().then(data => {

            this.question = this.parseData(data)
            console.log(this.question)
            this.gameLoop()


        }).catch(err => {

            this._stopping = true
            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    parseData(data) {

        var parsed = data.data
        parsed.question = parsed.question.replace(/<\/?[a-z]*>/gi, '')
        parsed.choices = parsed.choices.map(item => item.replace(/<\/?[a-z]*>/gi, ''))

        return parsed
    }

    process(message) {
        
        var answer = message.content.toLowerCase()

        if (answer === this.question.choices[this.question.correct_choice] && !this._questionEnded) {

            var winner = message.author.username
            this.sendMessage("great answer " + winner + '. (answer: ' + this.question.choices[this.question.correct_choice] + ')')
            this._answered = true
        }
    }

    gameLoop() {

        var counter = 1
        var qPosted = false

        var game = setInterval(() => {

            if (!this._answered) {

                if (!qPosted) {

                    this.sendMessage(`${this.question.instruction}: ${this.question.question}`)
                    this.sendMessage(`${this.question.choices.join(' | ')}`)
                    qPosted = true
                    this._questionEnded = false
                }
                else {

                    if (counter%20 == 0) {

                        this.sendMessage(`Time's up, it was choice ${this.question.correct_choice} (${this.question.choices[this.question.correct_choice + 1]})`)
                        this._answered = true
                        this._questionEnded = true
                        this._stopping = true
                    }

                    counter += 1
                } 
            }
            else {

                this._answered = true
                this._questionEnded = true
                this._stopping = true
                clearInterval(game)
                return false
            }

        }, 2000)
    }

    isRunning() {

        return !this._stopping
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}