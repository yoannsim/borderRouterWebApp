let mqqtHost = 'broker.emqx.io'
let mqqtPort = 8084


function afficheDataBrute(message){

    let msg=message.payloadString;
    let boardStatus  = JSON.parse(msg)

    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.getElementById('div1');
    // crée un nouvel élément div


    boardStatus.forEach(element => {
        console.log(element);

        //retirer les doublons
        var elem = document.getElementById(element.id);
        if(elem){
            elem.remove();
        }

        var newDiv = document.createElement("div");
        newDiv.id = element.id;
        newDiv.className = "themed-container"

        // et lui donne un peu de contenu
        var newContent = document.createTextNode(element.name + ": "+ element.val +" "+element.unit+ "\n");
        newDiv.appendChild(newContent);
        document.body.insertBefore(newDiv,currentDiv);
    });

}


connectMQ(mqqtHost,mqqtPort,"","",afficheDataBrute,"")
