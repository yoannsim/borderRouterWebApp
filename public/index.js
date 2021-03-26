let mqqtHost = 'broker.emqx.io'
let mqqtPort = 8084
var socket = io();

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
          let boardStatus  = JSON.parse(msg)
            boardStatus.forEach(element => {
                console.log(element);
                 // crée un nouvel élément div
                var newDiv = document.createElement("div");
                // et lui donne un peu de contenu
                var newContent = document.createTextNode(JSON.stringify(element));
                // ajoute le nœud texte au nouveau div créé
                newDiv.appendChild(newContent);

                // ajoute le nouvel élément créé et son contenu dans le DOM
                var currentDiv = document.getElementById('data');
                document.body.appendChild(newDiv);

            });
        }

        
        $("#getTem").on('click',()=>{
            console.log('getTemp')
            sendUpdate({"test":"getTemp"})
        })
}

connectMQ(mqqtHost,mqqtPort,"","")
