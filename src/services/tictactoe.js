const axios = require('axios')
const _reactDict = [
            "\u2196", // Top left
            "\u2B06", // Top
            "\u2197", // Top right
            "\u2B05", // Left
            "\u23FA", // Middle
            "\u27A1", // Right
            "\u2199", // Bottom left
            "\u2B07", // Bottom
            "\u2198"  // Bottom right
        ]
const _reactionsArray = [':white_large_square:', ':regional_indicator_x:', ':o2:']

module.exports = class Tictactoe
{
    constructor(message, firstMessage) {

        this.message = message
        this._stopping = false
        this.grid = null
        this.gridArray = null
        this.players = []
        this.playerTurn = null
        this.turnMessage = null
        this.firstMessage = firstMessage
        this.initGame()
    }

    initGame() {

        this.players.push(this.firstMessage.author.id)

        this.gridArray = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
        ]

        var content = this.getGrid()

        this.sendMessage(`${this.firstMessage.author.username} is waiting for a player to join...`).then(message => {

            this.turnMessage = message
        })

        this.sendMessage(content).then(message => {

            this.grid = message
            _reactDict.forEach(reaction => this.grid.react(reaction))
        })
    }

    getGrid() {

        var content = ''

        for (var i = 0; i < 9; i++) {

            content += this.getReactionAt(i)

            if ((i+1)%3 == 0) {

                content += '\n'
            }
        }

        return content
    }

    updateGrid() {

        var content = this.getGrid()

        this.grid.edit(content)

        this.checkVictory()
    }

    getReactionAt(i) {

        return _reactionsArray[this.gridArray[i]]
    }

    getPlayerSymbol(user) {
        return this.players.indexOf(user.id) > -1 ? this.players.indexOf(user.id) + 1 : null
    }

    nextTurn(id) {

        if (this.players[0] == id) {

            this.playerTurn = this.players[1]
        }
        else if (this.players[1] == id) {

            this.playerTurn = this.players[0]
        }

        this.turnMessage.edit(`<@${this.playerTurn}> turn to play...`)
    }

    checkVictory() {

        if (
            (this.gridArray[0] == this.gridArray[1] && this.gridArray[1] == this.gridArray[2] && this.gridArray[0] != 0) ||
            (this.gridArray[3] == this.gridArray[4] && this.gridArray[4] == this.gridArray[5] && this.gridArray[3] != 0) ||
            (this.gridArray[6] == this.gridArray[7] && this.gridArray[7] == this.gridArray[8] && this.gridArray[6] != 0) ||

            (this.gridArray[0] == this.gridArray[4] && this.gridArray[4] == this.gridArray[8] && this.gridArray[0] != 0) ||
            (this.gridArray[2] == this.gridArray[4] && this.gridArray[4] == this.gridArray[6] && this.gridArray[2] != 0)
           ) {

            this.turnMessage.edit(`<@${this.playerTurn}> lost what a noob!`)
            this._stopping = true
        }

        if (
                this.gridArray[0] != 0 && this.gridArray[1] != 0 && this.gridArray[2] != 0
             && this.gridArray[3] != 0 && this.gridArray[4] != 0 && this.gridArray[5] != 0
             && this.gridArray[6] != 0 && this.gridArray[7] != 0 && this.gridArray[8] != 0
           ) {

            this.turnMessage.edit(`draw haha love this tictactoe game very competitive`)
            this._stopping = true
        }
    }

    isRunning() {

        return !this._stopping
    }

    process() {

        return null
    }

    processEvent(message, user) {

        if (this._stopping == true) return null

        var targetIdx = _reactDict.indexOf(message._emoji.name)
        if (targetIdx != -1) {


            if (this.players.length < 2 && user.id != this.players[0]) {

                this.players.push(user.id)
                this.playerTurn = user.id
            }

            if (this.gridArray[targetIdx] == 0 && this.playerTurn == user.id) {

                this.gridArray[targetIdx] = this.getPlayerSymbol(user)
                this.nextTurn(user.id)
            }
            else return null

            this.updateGrid()
        } 
    }

    sendMessage(content) {

        return this.message.channel.send(content)
    }
}