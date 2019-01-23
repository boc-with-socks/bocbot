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
}