$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];
    pressureData = [];
  
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperatur',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Luftfuktighet',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      },
      {
        fill: false,
        label: 'Lufttryck',
        yAxisID: 'Pressure',
        borderColor: "rgba(0, 215, 0, 1)",
        pointBoarderColor: "rgba(0, 215, 0, 1)",
        backgroundColor: "rgba(0, 215, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(0, 215, 0, 1)",
        pointHoverBorderColor: "rgba(0, 215, 0, 1)",
        data: pressureData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Miljö (K16)',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        ticks: {
          min: -15.0,
          max: 35.0
        },
        scaleLabel: {
          labelString: 'Temperatur (C)',
          display: true
        },
        position: 'left',
      }, {
        id: 'Humidity',
        type: 'linear',
        ticks: {
          min: 0,
          max: 100
        },
        scaleLabel: {
          labelString: 'Luftfuktighet (%)',
          display: true
        },
        position: 'right'
      }, {
        id: 'Pressure',
        type: 'linear',
        ticks: {
          min: 950.0,
          max: 1050.0
        },
        scaleLabel: {
          labelString: 'Relativt lufttryck (mbar)',
          display: true
        },
        position: 'right'
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('ws://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.esp2_temp1) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.esp2_temp1);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.esp2_hum1) {
        humidityData.push(obj.esp2_hum1);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      if (obj.esp2_pres1) {
        pressureData.push(obj.esp2_pres1);
      }
      if (pressureData.length > maxLen) {
        pressureData.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
