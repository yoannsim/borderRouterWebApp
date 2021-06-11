let mqqtHost = 'broker.emqx.io'
let mqqtPort = 8084

function afficheDataBrute(message){

    let msg=message.payloadString;
    let boardStatus  = JSON.parse(msg)

    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.getElementById('div1');
    // crée un nouvel élément div


    boardStatus.forEach(element => {

        //retirer les doublons
        var elem = document.getElementById(element.id);
        if(elem){
            elem.remove();
        }



        if( element.role == "out"){

            var elem = document.getElementById("but");
            if(elem){
                elem.remove();
            }
            var btn;
            btn = document.createElement("BUTTON");
            btn.id = "but";
            btn.innerHTML = element.name;
            btn.className = "btn btn-primary btn-lg"
            btn.onclick = function(event) {

                var message = {id: element.id,state : "on"}
                simpleMQTTSend(mqqtHost,mqqtPort,"","","/heig/cse/to/borderRouter",message);
            }

                document.body.insertBefore(btn,currentDiv);
        }else{

            var newDiv = document.createElement("div");
            newDiv.id = element.id;
            newDiv.className = "themed-container"

            var newContent = document.createTextNode(element.name + ": "+ element.val +" "+element.unit+ "\n");

            newDiv.appendChild(newContent);
            document.body.insertBefore(newDiv,currentDiv);
        }



    });

}


connectMQ(mqqtHost,mqqtPort,"","",afficheDataBrute,"/heig/cse/to/borderRouter")
