const trivia = require('./trivia')

module.exports = {
    
    process: function(msg) {

        //console.log(msg)

        if (checkPrefix(msg.content)) {

            var cmd = parseCommand(msg.content)
            switch (cmd) {

                case 1:
                    trivia.start(msg)
                    break
                case 2:
                    trivia.stop(msg)
                    break
                default:
                    return false
            }
        }
        else if (!msg.author.bot) {

            if (trivia.getStatus()) {
                
                trivia.process(msg)
            }
        }
    },

}

const checkPrefix = function(msg) {

    var ar = msg.split(' ')

    if (ar[0] == "boc") {
        return ar[1]
    }
    else {
        return false
    }
}

const parseCommand = function(msg) {
    
    var cmd = msg.split(' ')[1]
    switch (cmd) {
        case 'trivia':
            return 1
        case 'triviastop':
            return 2
        default:
            return false
    }
}

const sendMsg = function(msg, toSend) {
    msg.channel.send(toSend)
}
