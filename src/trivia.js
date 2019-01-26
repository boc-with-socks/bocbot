var he = require('he')
const OpenTDB = require('./trivia_questions/opentdb.js')

module.exports = class Trivia
{
    constructor(message, author, options = null) {

        this._message = message
        this._author = author
        this._options = options
        this._questions = null
        this._idHistory = []
        this._currentQ = {}
        this._currentH = null
        this._answered = false
        this._scores = {}
        this._stopping = false

        this._difficulty = "easy"
        this._category = 31
    }

    start() {
        this.questionLoader()
    }

    stop() {
        this._stopping = true
    }

    questionLoader() {
        console.log(this._options)

        var resource = new OpenTDB("")

        resource.load().then(res => {
        
            console.log(res.data)
        })
        /*fetchUrl('https://opentdb.com/api.php?amount=10&category='+this._category+'&difficulty='+this._difficulty+'&type=multiple', (err, meta, body) => {
            
            console.log(JSON.parse(body.toString()))
            this._questions = JSON.parse(body.toString()).results
            this.decodeQuestions()
            this.gameLoop()
        })*/
    }

    questionPicker() {

        var len = this._questions.length
        var id = Math.floor((Math.random() * len))

        if (this._idHistory.indexOf(id) != -1) {

            this.questionPicker()
        }
        else {

            this._currentQ = this._questions[id]
            this._currentH = null
            this._idHistory.push(id)
            console.log(this._idHistory)
            return true
        }
    }

    process(message) {
        
        var answer = message.content.toLowerCase()

        if (answer === this._currentQ.correct_answer) {

            var winner = message.author.username
            this.sendMessage("great answer " + winner + '. (answer: ' + this._currentQ.correct_answer + ')')
            this._answered = true

            if (this._scores[winner]) {

                this._scores[winner] += 1
            }
            else {
                this._scores[winner] = 1
            }
        }
    }

    gameLoop() {

        this.questionPicker()
        var qPosted = false
        var counter = 0
        var hintCount = 0

        var game = setInterval(() => {

            if (!this._answered) {

                if (!qPosted) {

                    this.sendMessage('Question: ' + this._currentQ.question + ` (${this._currentQ.correct_answer.length} letters)`)
                    qPosted = true
                }
                else {

                    if (hintCount > 3) {

                        this.sendMessage('Time\'s up niggas, it was ' + this._currentQ.correct_answer)
                        this._answered = true
                    } 

                    if (counter%5 == 0) {

                        this.hintHandler()
                        hintCount += 1
                        this.printHint()
                        //this.sendMessage('Hint: ' + this._currentH)
                    }

                    counter += 1
                } 
            }
            else {

                if (this._idHistory.length == this._questions.length || this._stopping) {

                    this.sendMessage("End of trivia")
                    clearInterval(game)
                    return false
                }

                this.questionPicker()
                this.printScores()
                this._answered = false
                qPosted = false
                counter = 0
                hintCount = 0
            }

        }, 2000)
    }

    printScores() {

        var str = ""
        for (var k in this._scores) {
            str += k + ':' + this._scores[k] + ' '
        }
        this.sendMessage('Scores -> ' + str)
    }

    hintHandler() {

        if (this._currentH == null) {

            var h = this._currentQ.correct_answer
            this._currentH = h.replace(/[a-z0-9]/gi, '_')
        }
        else {

            var len = this._currentH.length

            if (len == 1) return false

            var toRevealCount = Math.ceil(0.25 * len)

            for (var i = 0; i < toRevealCount; i++) {

                var idx = 0
                var timeoutCounter = 0
                do {

                    idx = Math.floor(Math.random() * len)
                    timeoutCounter += 1
                    console.log("looping " + idx + ' ' + this._currentH[idx])
                }
                while(this._currentH[idx] != '_' && timeoutCounter < 50)
                
                this._currentH = this._currentH.substr(0, idx) + this._currentQ.correct_answer[idx] + this._currentH.substr(idx + 1, len)
                console.log(this._currentH)
            }

        }
    }

    decodeQuestions() {

        this._questions.forEach(item => {

            item.question = he.decode(item.question)
            item.correct_answer = he.decode(item.correct_answer)
            item.correct_answer = item.correct_answer.toLowerCase()
        })
    }

    /*removeWhichQuestions() {

        this._questions.forEach()
    }*/

    printHint() {

        var hint = this._currentH
        hint = hint.replace(/[_]/gi, '\\_')
        this.sendMessage('Hint: ' + hint)
    }

    sendMessage(content) {

        this._message.channel.send(content)
    }
}