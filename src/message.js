module.exports = class Message
{
    constructor(message) {

        this._author = message.author
        this._channel = message.channel.id
        this._content = message.content
        this._raw = message
    }

    getCommand() {

        var ar = this._content.split(' ')

        if (ar[0] == "boc") {

            switch (ar[1]) {

                case 'trivia':
                    return 1

                case 'triviastop':
                    return 2
                
                case 'talk':
                    return 3

                case 'categories':
                    return 4

                case 'lol':
                    return 5

                case 'haha':
                    return 6

                case 'gay':
		            return 7

                case 'xd':
                    return 8

                case 'uhbijnokn':
                    return 9

                case 'dota':
                    return 10

                case 'merc':
                    return 11

                case 'bible':
                    return 12

                case 'cat':
                    return 13

                case 'damkus':
                    return 14

                case 'job':
                    return 15

                case 'savi':
                    return 16

                default:
                    return false
            }
        }
        else {

            return false
        }
    }

    getMessage() {

        return this._raw
    }

    getOptions() {

        if (this.getCommand()) {
            
            var str = this._content.substr(this._content.indexOf(' ') + 1)
            var ar = str.split(' ')
            var options = []

            ar.forEach(item => {

                var cmd = item.split(/-(.+)/)[1]
                
                if (cmd != undefined) {

                    options.push(cmd)
                }
            })

            return options
        }
        else {

            return false
        }
    }
}
