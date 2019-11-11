const axios = require('axios')


const DOTA_IDS = {
    'boc': 52870512,
    'fip': 46647400,
    'savi': 180267353,
    'sola': 130939712,
    'merc': 180267353
}

module.exports = class Dota 
{
    constructor(message, options = []) {

        this.message = message

        if (this.checkOptions(options) == 0) return 0

        console.log(options)
        this.endpoint = `https://api.opendota.com/api/players/${DOTA_IDS[options[0]]}/matches?limit=30`
        this.load().then(data => {

            var games = data.data

            this.run(games, options[0])
        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    parseData(data) {

        return data.request.res.responseUrl
    }

    checkOptions(options) {

        if (options.length == 0) {

            this.sendMessage(`you need to specify name`)
            return 0
        }

        if (DOTA_IDS[options[0]] == undefined) {

            this.sendMessage(`name not found`)
            return 0
        }

        return 1
    }

    run(games, player) {

        games = games.filter(item => {

            var today = new Date()
            var day = today.getDay() || 7
            if (day !== 1)
                today.setHours(-24 * (day - 1)) 

            return new Date(item.start_time*1000) >= today
        })

        if (games.length == 0) {

            this.sendMessage(`this nigga didnt play this week`)
            return 0
        }

        console.log(games)

        var res = []
        games.forEach(game =>  {
            if (game.player_slot < 5) {
                if (!game.radiant_win) {
                    res.push({'count': 1, 'duration': game.duration,'deaths': game.deaths})
                }
            }
            else if (game.radiant_win) {
                res.push({'count': 1, 'duration': game.duration,'deaths': game.deaths})
            }
        })

        res =  res.reduce((prev, cur) => {

            return {'count': prev.count + cur.count, 'duration': prev.duration + cur.duration,'deaths': prev.deaths + cur.deaths}
        })

        if (res.length == 0) {

            this.sendMessage(`this nigga didnt lose games this week`)
            return 0
        }

        this.sendMessage(`${player} spent ${Math.round(res.duration/60)}mins (${Math.round(res.duration/60/60)}hrs) griefing and losing ${res.count} games this week, he fed ${res.deaths} times`)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}