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

                case 'stop':
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

                case 'boc':
                    return 17

                case 'affly':
                    return 18

                case 'misioh':
                    return 19

                case 'tictac':
                    return 20

                case 'wow':
                    return 21

                case 'virus':
                    return 22

                case 'roll':
                    return 23

                case 'log':
                    return 50

                case 'help':
                    return 99

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

    getAuthor() {

        return this._author
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
