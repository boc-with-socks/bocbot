const axios = require('axios')
const Canvas = require('canvas')
const ChartjsNode = require('chartjs-node')
const {RichEmbed} = require('discord.js')
const Country = require('./resources/country.js')
const chartPath = __dirname  + '/../../img/chart.png'
const plugin = {
        beforeDraw: function(chartInstance) {
          var ctx = chartInstance.chart.ctx;
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
}



module.exports = class Virus
{
    constructor(message, options = []) {

        this.message = message

        this.countries = ['AF', 'AL', 'DZ', 'AO', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS'
        , 'BD', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'BN', 'BG', 'BF'
        , 'BI', 'KH', 'CM', 'CA', 'CI', 'CF', 'TD', 'CL', 'CN', 'CO', 'CG', 'CD', 'CR'
        , 'HR', 'CU', 'CY', 'CZ', 'DK', 'DP', 'DJ', 'DO', 'CD', 'EC', 'EG', 'SV', 'GQ'
        , 'ER', 'EE', 'ET', 'FK', 'FJ', 'FI', 'FR', 'GF', 'TF', 'GA', 'GM', 'GE', 'DE'
        , 'GH', 'GR', 'GL', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HK', 'HU', 'IS', 'IN'
        , 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KP', 'XK'
        , 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LT', 'LU', 'MK', 'MG', 'MW'
        , 'MY', 'ML', 'MR', 'MX', 'MD', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NP', 'NL'
        , 'NC', 'NZ', 'NI', 'NE', 'NG', 'KP', 'NO', 'OM', 'PK', 'PS', 'PA', 'PG', 'PY'
        , 'PE', 'PH', 'PL', 'PT', 'PR', 'QA', 'XK', 'RO', 'RU', 'RW', 'SA', 'SN', 'RS'
        , 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'KR', 'SS', 'ES', 'LK', 'SD', 'SR'
        , 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TT', 'TN'
        , 'TR', 'TM', 'AE', 'UG', 'GB', 'UA', 'US', 'UY', 'UZ', 'VU', 'VE', 'VN', 'EH'
        , 'YE', 'ZM', 'ZW']

        this.country = this.checkOptions(options)

        var cnty = new Country(this.country)
        this.countryName = cnty.getCountryName(this.country)

        this.endpoint = "https://api.thevirustracker.com/free-api?countryTimeline=" + this.country

        this.load().then(data => {
console.log('here')
        console.log(data)
        console.log(data.data)

            this.run(data.data)
        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    checkOptions(options) {

        if (options.length == 1) {

            if (this.countries.includes(options[0].toUpperCase())) return options[0].toUpperCase()
        }

        this.sendMessage('Country not found... defaulting to FR')
        return 'FR'
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }

    parseData(data) {

        var date = []
        var new_daily_cases = []
        var new_daily_deaths = []
        var total_cases = []
        var total_recoveries = []
        var total_deaths = []

        data.forEach(day => {

            date.push(day[0])
            new_daily_cases.push(day[1].new_daily_cases)
            new_daily_deaths.push(day[1].new_daily_deaths)
            total_cases.push(day[1].total_cases)
            total_recoveries.push(day[1].total_recoveries)
            total_deaths.push(day[1].total_deaths)
        })

        console.log(date,new_daily_cases,new_daily_deaths,total_cases,total_recoveries,total_deaths)

        return {date,new_daily_cases,new_daily_deaths,total_cases,total_recoveries,total_deaths}
    }


    generate(data) {

        var chartNode = new ChartjsNode(800, 400);


        return chartNode.drawChart({
                type: 'bar',
                data: {
                    labels: data.date,
                    datasets: [
                    {
                        label: 'new_daily_cases',
                        data: data.new_daily_cases,
                        yAxisID: 'A',
                        type: 'line',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    // {
                    //     label: 'new_daily_deaths',
                    //     data: timeline.new_daily_deaths,
                    //     yAxisID: 'A',
                    //     type: 'line'
                    // },
                    // {
                    //     label: 'total_cases',
                    //     data: timeline.total_cases,
                    //     type: 'bar',
                    //     yAxisID: 'B'
                    // }
                    // {
                    //     label: 'total_recoveries',
                    //     data: timeline.total_recoveries
                    // },
                    {
                        label: 'total_deaths',
                        data: data.total_deaths,
                        type: 'bar',
                        yAxisID: 'B',
                        backgroundColor: 'rgba(200, 0, 50, 0.5)'
                    }
                    ]
                },
                options: {
                    layout: {
                        padding:{
                            left: 30,
                            right: 30, 
                            top: 30,
                            bottom: 30
                        }
                    },
                    scales: {
                        yAxes: [
                        {
                            id: 'A',
                            type: 'linear',
                            position: 'left',
                            scaleLabel: {display:true, labelString: '# New daily cases'}
                        },
                        {
                            id: 'B',
                            type: 'linear',
                            position: 'right',
                            scaleLabel: {display:true, labelString: '# Total deaths'}
                        }
                        ]
                    },
                    plugins: plugin,
                    title: {
                        display: true,
                        fontSize: 16,
                        text: this.countryName
                    }
                }
            })
            .then(() => {
                // now we have a chart
                // lets get the image stream
                return chartNode.getImageStream('image/png');
            })
            .then(imageStream => {
                // now you can do anything with the image, like upload to S3
                // lets get the image buffer
                return chartNode.getImageBuffer('image/png');
            })
            .then(imageBuffer => {
                // now you can modify the raw PNG buffer if you'd like
                // want to write the image directly to the disk, no problem
                return chartNode.writeImageToFile('image/png', chartPath);
            })
            .then(() => {
               chartNode.destroy() 
            });

    }

    numberWithCommas(x) {
        
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    percentage(x) {

        return ( x > 0 ? '+' + x + '%' : x + '%')

    }

    beautify(data) {


        return {

            date: data.date,
            new_cases: this.numberWithCommas(data.new_cases),
            new_death: this.numberWithCommas(data.new_death),
            total_cases: this.numberWithCommas(data.total_cases),
            total_deaths: this.numberWithCommas(data.total_deaths),
            total_recoveries: this.numberWithCommas(data.total_recoveries),
            new_cases_dod: this.percentage(data.new_cases_dod),
            new_death_dod: this.percentage(data.new_death_dod),
            total_cases_dod: this.percentage(data.total_cases_dod),
            total_death_dod: this.percentage(data.total_death_dod),
            total_recoveries_dod: this.percentage(data.total_recoveries_dod)
        }
    }

    computeData(data) {

        var latest = data.pop()
        var beforeLatest = data.pop()

        var date = latest[0]
        var new_cases = latest[1].new_daily_cases
        var new_death = latest[1].new_daily_deaths
        var total_cases = latest[1].total_cases
        var total_deaths = latest[1].total_deaths
        var total_recoveries = latest[1].total_recoveries
        var new_cases_dod = Math.round(((new_cases / beforeLatest[1].new_daily_cases) - 1 ) * 1000) / 10
        var new_death_dod = Math.round(((new_death /beforeLatest[1].new_daily_deaths) - 1 ) * 1000) / 10
        var total_cases_dod = Math.round(((total_cases / beforeLatest[1].total_cases) - 1 ) * 1000) / 10
        var total_death_dod = Math.round(((total_deaths / beforeLatest[1].total_deaths) - 1 ) * 1000) / 10
        var total_recoveries_dod = Math.round(((total_recoveries / beforeLatest[1].total_recoveries) - 1 ) * 1000) / 10


        var result = {
            date: date,
            new_cases: new_cases,
            new_death: new_death,
            total_cases: total_cases,
            total_deaths: total_deaths,
            total_recoveries: total_recoveries,
            new_cases_dod: new_cases_dod,
            new_death_dod: new_death_dod,
            total_cases_dod: total_cases_dod,
            total_death_dod: total_death_dod,
            total_recoveries_dod: total_recoveries_dod
        }

        return this.beautify(result)
    }
    
    run(data) {

        var timeline_raw = Object.entries(data.timelineitems[0])
        timeline_raw.pop()
        console.log(timeline_raw)
        var timeline = this.parseData(timeline_raw)
        var stats = this.computeData(timeline_raw)
        console.log(stats)

        this.generate(timeline)
        .then(() => {

            const embed = new RichEmbed()
                .setAuthor('Brought to you by Bocbot Inc.', 'https://www.redditstatic.com/avatars/avatar_default_09_FF585B.png', 'https://github.com/boc-with-socks/bocbot')
                .setColor(0xff0000)
                .setTitle(' :flag_' + this.country.toLowerCase() + ':  CORANAVIRUS TRACKER: ' + this.countryName + ' (' + stats.date + ')')
                .setDescription('damkus sucks cocks btw')
                .addField('Today\'s new cases', stats.new_cases + ' (' + stats.new_cases_dod + ' DoD)', true)
                .addBlankField(true)
                .addField('Today\'s death', stats.new_death + ' (' + stats.new_death_dod + ' DoD)', true)
                .addField('Total cases', stats.total_cases + ' (' + stats.total_cases_dod + ' DoD)', true)
                .addBlankField(true)
                .addField('Total death toll', stats.total_deaths + ' (' + stats.total_death_dod + ' DoD)', true)
                .addField('Total recoveries', stats.total_recoveries + ' (' + stats.total_recoveries_dod + ' DoD)')
                .setImage('attachment://chart.png')
                .attachFile(chartPath)
                .setFooter('Source: https://thevirustracker.com/')

            this.sendMessage(embed)
        })
        .catch((err) => console.log(err))

    }

}