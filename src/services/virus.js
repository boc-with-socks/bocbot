const axios = require('axios')
const Canvas = require('canvas')
// const Chart = require('nchart')
// const fs = require('fs')
const ChartjsNode = require('chartjs-node')


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
//           var canvas = Canvas.createCanvas(800, 800)
//           var ctx = canvas.getContext('2d')

//         var datum = {
//             labels: ["January", "February", "March", "April", "May", "June", "July"],
//             datasets: [
//                 {
//                     label: "My First dataset",
//                     fillColor: "rgba(220,220,220,0.2)",
//                     strokeColor: "rgba(220,220,220,1)",
//                     pointColor: "rgba(220,220,220,1)",
//                     pointStrokeColor: "#fff",
//                     pointHighlightFill: "#fff",
//                     pointHighlightStroke: "rgba(220,220,220,1)",
//                     data: [65, 59, 80, 81, 56, 55, 40]
//                 },
//                 {
//                     label: "My Second dataset",
//                     fillColor: "rgba(151,187,205,0.2)",
//                     strokeColor: "rgba(151,187,205,1)",
//                     pointColor: "rgba(151,187,205,1)",
//                     pointStrokeColor: "#fff",
//                     pointHighlightFill: "#fff",
//                     pointHighlightStroke: "rgba(151,187,205,1)",
//                     data: [28, 48, 40, 19, 86, 27, 90]
//                 }
//             ]
//         };
// var options = {scaleShowGridLines : true}
// var myLineChart = new Chart(ctx).Line(datum, options);
         
//         canvas.toBuffer(function (err, buf) {
//           if (err) throw err;
//           fs.writeFile(__dirname + '/pie.png', buf, (error) => {console.log(error)});
//         })

        const options = {
            labels: ['January', 'February', 'March', 'April'],
            xAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: "OP/s (higher is better)"
                    }
                }
            ],
            datasets: [{
                label: 'Bar Dataset',
                data: [10, 20, 30, 40]
            }, 
            {
                label: 'Line Dataset',
                data: [50, 50, 50, 50],

                // Changes this dataset to become a line
                type: 'line'
            }]
        };


        const ChartjsNode = require('chartjs-node');
// 600x600 canvas size
        var chartNode = new ChartjsNode(600, 600);
        // var randomnumber=Math.random();
        // var imagename = "testimage"+randomnumber+".png"
        // module.exports = imagename

        // each api returns a Promise
        chartNode.drawChart({
                type: 'bar',
                data: {
                    labels: ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
                    datasets: [{
                        label: 'Antal akkrediteringer',
                        data: [57, 125, 249, 262, 271, 289, 227, 98, 126, 93, 90],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
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
                return chartNode.writeImageToFile('image/png', './testimage.png');
            })
            .then(() => {
               chartNode.destroy() 
            });

    // 600x600 canvas size

    }

    parseData(data) {


    }

}