const fs = require('fs')
const logPath = __dirname  + '/../../error.log'

module.exports = class Log
{
    constructor(message, options = [], author) {

        this.message = message
        this.author = author
        var linesToParse = 5

        if (options.length == 1 && !isNan(options[0] - 0)) {

            linesToParse = options[0]
        }

        this.load(linesToParse)
    }

    load(n) {

        fs.readFile(logPath, 'utf8', (err, data) => {

            try {
                  
                if (err) {throw err}

                var lines = data.trim().split('\n')
                this.author.send(this.getLastLines(lines, n))
                this.sendMessage('sent ;)')
            } catch (err) {

                console.log('error: ' + err)
            }    
        })
    }

    getLastLines(ar, n) {

        var endLine = ar.length - 1
        var startLine = Math.max(endLine - n + 1, 0)

        var logs = []
        for (var i = startLine; i <= endLine; i++) {

            logs.push(ar[i])
        }

        return logs
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}