var fs = require('fs')
var fetchUrl = require("fetch").fetchUrl
var he = require('he')
//var data = fs.readFileSync('qs.json', 'utf-8')
//var qs = JSON.parse(data)

module.exports = {

    start: function(msg) {
        sendMsg(msg, 'Trivia starting')
        status = true

        fetchUrl('https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiple', (err, meta, body) => {
            console.log(JSON.parse(body.toString()))
            qs = JSON.parse(body.toString()).results
            decodeQuestions()
            gameLoop(msg)
        })

        return true

    },
    stop: function(msg) {
        sendMsg(msg, 'Trivia stopping')
        status = false
        return true
    },
    getStatus: function() {
        console.log(status)
        return status
    },
    process: function(msg) {
        
        var answer = msg.content.toLowerCase()

        if (answer === currentQ.correct_answer) {

            var winner = msg.author.username
            sendMsg(msg, "great answer " + winner + '. (answer: ' + currentQ.correct_answer + ')')
            answered = true

            if (scores[winner]) {

                scores[winner] += 1
            }
            else {
                scores[winner] = 1
            }
        }
    }
}

const sendMsg = function(msg, toSend) {
    msg.channel.send(toSend)
}

const gameLoop = function(msg) {

    questionPicker()
    var qPosted = false
    var counter = 0
    var hintCount = 0

    var game = setInterval(() => {


        if (!answered) {

            if (!qPosted) {

                sendMsg(msg, 'Question: ' + currentQ.question + ` (${currentQ.correct_answer.length} letters)`)
                qPosted = true
            }
            else {

                if (counter%5 == 0) {

                    hintHandler()
                    hintCount += 1
                    sendMsg(msg, 'Hint: ' + currentH)
                }

                if (hintCount > 3) {

                    sendMsg(msg, 'Time\'s up niggas, it was ' + currentQ.correct_answer)
                    answered = true
                } 

                counter += 1
            } 
        }
        else {

            if (idHistory.length == qs.length) {
                sendMsg(msg, "End of trivia")
                clearInterval(game)
                return false
            }

            questionPicker()
            printScores(msg)
            sendMsg(msg, "going to the next question")
            answered = false
            qPosted = false
            counter = 0
            hintCount = 0
        }


    }, 2000)
}

const questionPicker = function() {

    
    var len = qs.length
    var id = Math.floor((Math.random() * len))

    if (idHistory.indexOf(id) != -1) {

        questionPicker()
    }
    else {

        currentQ = qs[id]
        currentH = null
        idHistory.push(id)
        console.log(idHistory)
        return true
    }

}

const printScores = function(msg) {

    var str = ""
    for (var k in scores) {
        str += k + ':' + scores[k] + ' '
    }
    sendMsg(msg, 'Scores -> ' + str)
}

const decodeQuestions = function() {

    qs.forEach(item => {
        item.question = he.decode(item.question)
        item.correct_answer = he.decode(item.correct_answer)
        item.correct_answer = item.correct_answer.toLowerCase()
    })
}

const hintHandler = function() {

    if (currentH == null) {

        var h = currentQ.correct_answer
        currentH = h.replace(/[a-z0-9]/gi, '-')
    }
    else {

        var len = currentH.length

        var toRevealCount = Math.ceil(0.25 * len)

        for (var i = 0; i < toRevealCount; i++) {

            var idx = 0
            do {

                idx = Math.floor(Math.random() * len)
                console.log("looping " + idx + ' ' + currentH[idx])
            }
            while(currentH[idx] != '-')
            
            currentH = currentH.substr(0, idx) + currentQ.correct_answer[idx] + currentH.substr(idx + 1, len)
            console.log(currentH)
        }

    }
}

var status = false
var answered = false
var currentQ = null
var currentH = null
var scores = {}
var qs = null
var idHistory = []