let mqqtHost = 'broker.emqx.io'
let mqqtPort = 8084

// Load the Visualization API and the corechart package.
 google.charts.load('current', {'packages':['corechart']});
 // Set a callback to run when the Google Visualization API is loaded.
 google.charts.setOnLoadCallback(chartsReady);
 let temperatureChartData ;
 let temperatureChartDataGarage ;
 function chartsReady(){
    temperatureChartData = google.visualization.arrayToDataTable([
        ['timeString', 'Temperature salon'],
        ['10:23:11',25],
		['10:28:11',20]
      ]);
     temperatureChartDataGarage = google.visualization.arrayToDataTable([
         ['timeString', 'Temperature garage'],
         ['10:23:11',10],
         ['10:28:11',15]
     ]);

    drawChart(temperatureChartData);

     drawChart(temperatureChartDataGarage);
	 $("#temperature_holder").text(25)
    connectMQ(mqqtHost,mqqtPort,"","")
 }
 
function updateCharts(boardStatus){
    let temperature = Math.round(((4096/3300)*boardStatus.tSensor)/10 * 100) / 100
    let date = new Date()
    let timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(timeString);
    temperatureChartData.addRow([timeString,temperature])
    if(temperatureChartData.getNumberOfRows() > 20){
        temperatureChartData.removeRow(0)
    }

    drawChart(temperatureChartData)
    $("#temperature_holder").text(temperature)
} 
function drawChart(data,realyData) {
      var temperatureChatOptions = {
        title: 'Temperature',
        curveType: 'function',
        legend: { position: 'bottom' },
        animation:{
            duration: 500,
            easing: 'out',
          },
        hAxis:{
          showTextEvery:5,
        },
        vAxis:{
            minValue:15, 
            maxValue:35
        },
      };

      let temperatureChart = new google.visualization.LineChart(document.getElementById('temperature_chart_div'));
      temperatureChart.draw(data, temperatureChatOptions);

    let temperatureChartGarage = new google.visualization.LineChart(document.getElementById('temperature_chart_divGarage'));
    temperatureChartGarage.draw(data, temperatureChatOptions);

}

function connectMQ(host,port,username,password){
    var clientId = "ws" + Math.random();
        var client = new Paho.MQTT.Client(host, parseInt(port), clientId);
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        let connected = false
        // connect the client
        client.connect({
          useSSL: true,
          userName: username,
          password: password,
          onSuccess: onConnect,
          onFailure: onFailure
        });

        function onConnect() {
          // Once a connection has been made, make a subscription and send a message.
          console.log("onConnect");
          connected = true;
          client.subscribe("/heig/cse/from/borderRouter");
          //updateUI();
        }
        function onConnectionLost(responseObject) {
            connected=false
            console.log("onConnectionLost:", responseObject.errorMessage);
            connectMQ(host,port,username,password)
        }
        function onFailure(invocationContext, errorCode, errorMessage) {
            connected=false
          var errDiv = document.getElementById("error");
          console.log( "Could not connect to WebSocket server, most likely you're behind a firewall that doesn't allow outgoing connections");
          //updateUI();
        }
        
	    function sendUpdate(data){
            let message = new Paho.MQTT.Message(JSON.stringify(data));
            message.destinationName = "/heig/cse/to/borderRouter";
            client.send(message);
        }
        function onMessageArrived(message) {
          let msg=message.payloadString;
          console.log(msg);
          let boardStatus  = JSON.parse(msg)
          updateCharts(boardStatus )
        }

        
        $("#getTem").on('click',()=>{
            console.log('getTemp')
            sendUpdate({"test":"getTemp"})
        })
}
