const axios = require('axios')

var today = new Date()

module.exports = class Prayer 
{
    constructor(message) {

        this.message = message
        today = new Date() 

        this.endpoint = this.getEndpoint()

        this.load().then(data => {

            var days = data.data.data
            var day = this.getToday(days)

            this.run(day[0])

        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    getEndpoint() {

        var month = today.getMonth() + 1
        var year = today.getFullYear()

        return `http://api.aladhan.com/v1/calendarByCity?city=London&country=United+Kingdom&method=2&month=${month}&year=${year}`
    }

    getToday(days) {

        var todayFormatted = `${('0' + today.getUTCDate().toString()).slice(-2)}-${('0' + (today.getMonth() + 1).toString()).slice(-2)}-${today.getFullYear()}`

        return days.filter(item => {

            return item.date.gregorian.date == todayFormatted
        })
    }

    run(day) {

        var timings = day.timings
        delete timings.Sunset

        var currentHour = today.getUTCHours()
        var currentMinute = today.getMinutes()

        var selectedTimings = []
        for (var key of Object.keys(timings)) {
            
            var prayerHour = parseInt(timings[key].split(' ')[0].split(':')[0])
            var prayerMinute = parseInt(timings[key].split(' ')[0].split(':')[1])

            if (prayerHour > currentHour || (prayerHour == currentHour && prayerMinute > currentMinute)) {

                selectedTimings.push({'name': key, 'time': timings[key]})
            }
        }

        console.log(selectedTimings)

        var str = "mercs next prayer times are "
        var count = 0
        selectedTimings.forEach(item => {

            if (count < 3) str += `${item.name} at ${item.time.split(' ')[0]}, `
            count++
        })

        str = str.slice(0, -2)

        this.sendMessage(str)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}