const axios = require('axios')
const Canvas = require('canvas')
const Chart = require('nchart')
const fs = require('fs')

module.exports = class Virus
{
    constructor(message) {

        this.message = message

        this.endpoint = "https://api.thevirustracker.com/free-api?countryTimeline=US"
        
        this.load().then(data => {


            this.run(data.data)
        }).catch(err => {

            console.log(err)
        })
    }

    load() {

        return axios.get(this.endpoint)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
    
    run(data) {

        var timeline_raw = data.timelineitems
        console.log(timeline_raw)
        // var timeline = this.parseData(timeline_raw)
        // var chartOptions = {type: 'bar',
        //                     data: data}
        // var chartNode = new ChartjsNode(800,400)

        // return chartNode.drawChart()
        // console.log(data)
          var canvas = Canvas.createCanvas(800, 800)
          var ctx = canvas.getContext('2d')

var datum = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};
var options = {scaleShowGridLines : true}
var myLineChart = new Chart(ctx).Line(datum, options);
         
        canvas.toBuffer(function (err, buf) {
          if (err) throw err;
          fs.writeFile(__dirname + '/pie.png', buf, (error) => {console.log(error)});
        })
    }

    parseData(data) {

        // var ar = []
        // data.
    }

}