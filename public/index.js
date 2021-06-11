
let mqqtHost = 'broker.emqx.io'
let mqqtPort = 8084


function waitResp(message){

    let msg=message.payloadString;
    let Status  = msg
    console.log(status.toString())

    if(Status.toString() == "ok"){
        document.location.href= "users";
    }
}


connectMQ(mqqtHost,mqqtPort,"","",waitResp,"/heig/cse/connect/borderRouter")
