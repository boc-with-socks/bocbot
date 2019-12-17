const OpenTDB = require('./trivia_questions/opentdb.js')
const Damkus = require('./trivia_questions/damkus.js')

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
        this._questionEnded = false
    }

    start() {
        this.questionLoader()
    }

    stop() {
        this._stopping = true
    }

    questionLoader() {
        console.log(this._options)

        //var resource = new OpenTDB(this._options)
        var resource = new Damkus(this._options)
        this.sendMessage("Loading questions")
        
        resource.load().then(res => {
            //console.log(res.data.results)
            this._questions = JSON.parse(res.data)
            //this._questions = res.data.results
            this._questions = resource.parseQuestions(this._questions)
            console.log(this._questions)
            this.gameLoop()
        }).catch(err => {

            this.sendMessage(`damkus fix pls: ${err.response.data}`)
            this._stopping = true
            //console.log(err.response.data)
        })
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

        if (answer === this._currentQ.answer && !this._questionEnded) {

            var winner = message.author.username
            this.sendMessage("great answer " + winner + '. (answer: ' + this._currentQ.answer + ')')
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
        var qCounter = 1
        var hintCount = 0

        var game = setInterval(() => {

            if (!this._answered) {

                if (!qPosted) {

                    this.sendMessage('Question ' + qCounter + ': ' + this._currentQ.question + ` (${this._currentQ.answer.length} letters)`)
                    qPosted = true
                    qCounter++
                    this._questionEnded = false
                }
                else {

                    if (hintCount > 3) {

                        this.sendMessage('Time\'s up niggas, it was ' + this._currentQ.answer)
                        this._answered = true
                        this._questionEnded = true
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

                    this.printScores()
                    this.sendMessage("End of trivia")
                    this._stopping = true
                    this._answered = true
                    this._questionEnded = true
                    clearInterval(game)
                    return false
                }

                this.questionPicker()
                this.printScores()
                this._questionEnded = true
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
        this.sendMessage('Scores: ' + str)
    }

    hintHandler() {

        if (this._currentH == null) {

            var h = this._currentQ.answer
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
                
                this._currentH = this._currentH.substr(0, idx) + this._currentQ.answer[idx] + this._currentH.substr(idx + 1, len)
                console.log(this._currentH)
            }

        }
    }

    /*decodeQuestions() {

        this._questions.forEach(item => {

            item.question = he.decode(item.question)
            item.correct_answer = he.decode(item.correct_answer)
            item.correct_answer = item.correct_answer.toLowerCase()
        })
    }*/

    /*removeWhichQuestions() {

        this._questions.forEach()
    }*/

    processEvent(m, s) {

        return null
    }

    printHint() {

        var hint = this._currentH
        hint = hint.replace(/[_]/gi, '\\_')
        this.sendMessage('Hint: ' + hint)
    }

    isRunning() {

        return !this._stopping
    }

    sendMessage(content) {

        this._message.channel.send(content)
    }
}