var cont = 0;
var unaFicha;

let idClient = localStorage.getItem("idClient");

//var mySocket = new WebSocket("ws://140.238.155.132:8080/webSocket/"+idClient);
var mySocket = new WebSocket("ws://localhost:8080/webSocket/"+idClient);

pintarTabla();

/*---------------Logica para el socket--------------------*/
mySocket.onopen = function (e){}

mySocket.onmessage = function (e){
    let info = JSON.parse(e.data)
    let mensaje = info.msg.text;
    let nombreUsuario = info.msg.usuario.name;
    if(info.msg.tipo=="notificacion"){
        if(idClient==info.msg.destino){
            const user = obtenerCliente(idClient);
            let noti =` 
            <div class="nuevaNotificacion">`+
                nombreUsuario + mensaje +`
            </div>`
            $("#noti").append(noti);
        }
    }else if(info.msg.tipo=="Venmensaje"){
        if(idClient==info.msg.destino){
            let messagesend = `<div id="contMensajeAmigo">`
            +mensaje+
            `</div>`;
            $("#conversacion").append(messagesend);
        }
        if( info.msg.usuario.idClient == idClient){
            let messagesend = `<div id="contMensaje">`
                                    +mensaje+
                                `</div>`;
            $("#conversacion").append(messagesend);
        }

    }
}

async function sendText(idDestino) {
    const user = await obtenerCliente(idClient);
    let msg = {
        text: $("#message").val(),
        usuario: user,
        tipo: "Venmensaje",
        destino: idDestino
    };
    mySocket.send(JSON.stringify({msg}));
}

async function abrirConversacion(idAmigoLista){
    const compa = await obtenerCliente(idAmigoLista);
    let conversa = `
        <div class="ventanaConversacion">
            <div id = "nameChat" class="cabeceraConversacion" onclick="accionConversacion()">
             <a href="../perfilAmigo/PerfilAmigo.html">`+compa.name+`</a></div>
            <div id= "conversacion" class="contenidoConversacion">
                <input type="text" class="inputMensaje" id="message" placeholder="Escribe algo...">
                <button class="enviarMensaje" onclick="sendText(`+idAmigoLista+`)">Enviar</button>
            </div>
        </div>`
    $("#contenidoDer").append(conversa);
    cerrarVentanas();
}

async function obtenerCliente(idCLiente){
    return $.ajax({
        url:"/api/Client/"+idCLiente,
        type:"GET",
        datatype:"JSON",
        success: await function(respuesta){
            return respuesta
        }
    });
}

/*---------------Logica para ventanas emergentes--------------------*/

function cerrarVentanas(){
    var divs = document.getElementsByClassName("ventanaEmergentes")
    Array.from(divs).forEach((x) => {
        if (x.style.display === "block") {
          x.style.display = "none";
        }
      })
}

function abrirUsuario(){
    if(document.getElementById("ventanaUser").style.display =="block"){
        document.getElementById("ventanaUser").style.display="none";  
    }else{
        cerrarVentanas();
        document.getElementById("ventanaUser").style.display="block";
    }
}

function abrirMensajes(){
    if(document.getElementById("ventanaMessages").style.display=="block"){
        document.getElementById("ventanaMessages").style.display="none";
    }else{
        cerrarVentanas();
        document.getElementById("ventanaMessages").style.display="block";
        document.getElementById("ventanaMessages").innerHTML="";
        listarMensajes();
    }
}

function abrirNotificaciones(){
    if(document.getElementById("ventanaNoti").style.display=="block"){
        document.getElementById("ventanaNoti").style.display="none";

    }else{
        cerrarVentanas();
        document.getElementById("ventanaNoti").style.display="block";
    }
}

function accionConversacion(){
    if(document.getElementById("conversacion").style.display=="block"){
        document.getElementById("conversacion").style.display="none";
    }else{
        document.getElementById("conversacion").style.display="block";
    }
}

/*---------------Logica para pintar las fichas--------------------*/

var nombre="", posicion="", id=0, fecha="";

function obtenerFicha(idFicha){
    $.ajax({
        async: false,
        url:"/api/Fichas/"+idFicha,
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            id = respuesta.id;
            nombre = respuesta.name;
            posicion = respuesta.posicion;
            fecha = respuesta.fecha_nacimiento;   
        },
        error:function(xhr, respuesta){
            alert("Error de peticion");
        }
    });
}

function agregarFicha(idFicha){
    $.ajax({ 
        url:"/api/Client/saveFicha/"+idClient+"/"+idFicha+"/",
        error:function(xhr, respuesta){
            alert("Error de peticion")
        }
    });
}

function pintarFicha(){
    cont=cont+1; 
    let fila = '<div class="filaCaramelos" id="fila'+cont+'"></div>';
    $("#caramelos").append(fila);
    for(i = 0; i<5;i++){
        let url = 'src="'+obtenerCaramelo()+'"';
        let tarjeta = `
        <div class="cardbox">
            <div class="card">
                <div class="cardbody">
                    <img class="cardImgage"`+url+`alt="Jugador">
                </div>
                <div class="back"> 
                    <h2 id="nombre">`+nombre+`</h2>  
                    <p id="Posicion">`+posicion+`</p>
                    <p id="Numero Ficha">`+id+`</p>
                    <p id="Fecha Nacimiento">`+fecha+`</p>
                </div>
            </div>
        </div>`
         $("#fila"+cont).append(tarjeta);
    }
    pintarAbierta();
}

function obtenerCaramelo(){
    let num = Math.floor((Math.random() * 180) + 1);
    agregarFicha(num);
    obtenerFicha(num);
    if(num>=109){
        return "../../images/ima/" + num + ".png";
    }else{
        return "../../images/ima/" + num + ".jpg";
    }
}

/*----------------- Logica para pintar las tablas -----------------*/

function pintarTabla(){
    $.ajax({
        url:"/api/Fichas/all",
        type:"GET",
        datatype:"JSON",
        success:function(fichas){
            for(let i = 0; i<180 ; i++){
                let columna = `<tr id="`+i+`"class='fila'>                
                <td id="Equipo">`+fichas[i].equipo.name+`</td>
                <td id="Nombre">`+fichas[i].name+`</td>
                <td id="Posicion">`+fichas[i].posicion+`</td>
                <td id="nficha">`+fichas[i].id+`</td>
                </tr>`
                $("#tablaFichas").append(columna);
            }
        }
    });
}

function pintarAbierta(){
    $.ajax({
        url:"/api/Client/"+idClient,
        type:"GET",
        datatype:"JSON",
        success: function(respuesta){
            let fichas = [];
            for(let i = 0; i<respuesta.fichas.length;i++){
                fichas.push(respuesta.fichas[i].id);
            }
            fichas.sort((a,b)=>a-b);
            for(let i = 0 ; i<fichas.length ; i++){
                if((fichas[i])==(fichas[i-1])){
                    document.getElementById(fichas[i]-1).style.backgroundColor ="#dad865";
                }else{
                    document.getElementById(fichas[i]-1).style.backgroundColor = "#2e8c42";
                }
            }
        }
    });
}

/*-----------------Logica para el buscador-----------------*/

function obtenerUsername(){
    let username = $("#search").val();
    $.ajax({
        url:"/api/Client/obtener/"+username,
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            for(i = 0; i<respuesta.length;i++){
                if(respuesta[i].idClient!=idClient){
                    let infoVentana = `
                    <div id="`+respuesta[i].idClient+`" onclick="abrirPerAmigo(`+respuesta[i].idClient+`)" class="usuarioEncontrado">
                    <h1 class="nomUsuarioEnc">`+ respuesta[i].name+`</h1>
                    <h5>Fichas Encontradas: `+respuesta[i].fichas.length+`</h5>
                    </div>`
                    $("#ventanaBuscador").append(infoVentana);
                }
            }
            
        },
        error:function(xhr, respuesta){
            $("#ventanaBuscador").append("No encontramos a nadie :(");
        }
    });
}

/*-----------------Logica para el buscador-----------------*/

function abrirPerAmigo(idAmigo){
    localStorage.setItem("idAmigo", idAmigo);
    window.open("/code/perfilAmigo/PerfilAmigo.html", "_self");
}

function buscar(e){
    if(e.key=='Enter'){
        if(document.getElementById("ventanaBuscador").style.display==""){
            document.getElementById("ventanaBuscador").style.display="block";
        }
        document.getElementById('ventanaBuscador').innerHTML = '';
        obtenerUsername();
        
    }
}

/*------------Logica para listar los amigos -------------------- */

async function listarMensajes(){
    const user = await obtenerCliente(idClient);
    for(i = 0 ; i<user.idAmigos.length-1; i++){
        const compa = await obtenerCliente(user.idAmigos[i]);
        let notiMensaje =`
                <li class="mensaje" onclick="abrirConversacion(`+user.idAmigos[i]+`)">
                    <h2 class="nombreMensaje">`+compa.name+`</h2>
                    <p class="ultimoMensaje"> Hola! </p>
                </li>`
            $("#ventanaMessages").append(notiMensaje);
    }
}



