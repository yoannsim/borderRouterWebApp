function simpleMQTTSend(host,port,username,password,sendTopic,data){

    var clientId = "ws" + Math.random();
    var client = new Paho.MQTT.Client(host, parseInt(port), clientId);

    client.connect({
        useSSL: true,
        userName: username,
        password: password,
        onSuccess: onConnect
    });

    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("server ok");
        let message = new Paho.MQTT.Message(JSON.stringify(data));
        message.destinationName = sendTopic;
        client.send(message);

    }

}



function connectMQ(host,port,username,password,funcOnmessage,sendTopic){
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
    }

   function sendUpdate(data){
        let message = new Paho.MQTT.Message(JSON.stringify(data));
        message.destinationName = sendTopic;
        client.send(message);
    }

    function onMessageArrived(message) {
        console.log("new data");
        funcOnmessage(message);
    }


    $("#getTem").on('click',()=>{
        console.log('tryConnect')
        sendUpdate({connectStatus:"try"})
    })

}


