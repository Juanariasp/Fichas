
let idClient = localStorage.getItem("idClient");
let idAmigo = localStorage.getItem("idAmigo");

var mySocket = new WebSocket("ws://localhost:8080/webSocket/"+idClient);

iniciar()

/*---------------Logica para el socket--------------------*/

mySocket.onopen = function (e){}

async function obtenerCliente(idCLiente){
    return $.ajax({
        url:"/api/Client/"+idCLiente,
        type:"GET",
        datatype:"JSON",
        success: await function(respuesta){}
    });
}

/*---------------Logica para enviar notificacion de seguimiento--------------------*/

function agregarAmigo(){
    agregarAmigoBase();
    $.ajax({
        url:"/api/Client/saveAmigo/"+idClient+"/"+idAmigo+"/",
        success:function(respuesta){
            document.getElementById("agregarAmigo").style.display="none";
            let btnEnviarMensaje = ` 
            <button type="button"  id = "enviarMensaje" class="btn btn-dark" onclick="abrirBanMensaje()">
                Enviar Mensaje
            </button>`
            $("#contenedorBotonAmigo").append(btnEnviarMensaje);
            enviarNotificacion();
        },
        error:function(xhr, respuesta){
            alert("Error de peticion")
        }
    });
}


async function enviarNotificacion() {
    const user = await obtenerCliente(idClient);
    let msg = {
        origen: idClient,
        text: ", Te ha empezado a seguir!",
        usuario: user,
        tipo: "notificacion",
        destino: idAmigo
    };
    mySocket.send(JSON.stringify({msg}));
}

mySocket.onmessage = function (e){
    let info = JSON.parse(e.data)
    let origen = info.msg.origen;
    let mensaje = info.msg.text;
    let nombreUsuario = info.msg.usuario.name;
    let destino = info.msg.destino;
    if(info.msg.tipo=="notificacion"){
        if(idClient==info.msg.destino){
            const user = obtenerCliente(idClient);
            let noti =` 
            <div class="nuevaNotificacion">`+
            nombreUsuario +", ha empezado a seguirte!"+`
            </div>`
            $("#noti").append(noti);
            console.log("Tienes una notificacion de: " + nombreUsuario);
        }
    }
}

/*---------------Logica para cargar la pagina--------------------*/

async function iniciar() {
    cliente = await obtenerAmigo();
    document.getElementById("nombre").innerHTML = cliente.name;
}

function agregarAmigoBase(){
    $.ajax({
        url:"/api/Client/saveAmigo/"+idClient+"/"+idAmigo+"/",
        error:function(xhr, respuesta){
            alert("Error de peticion")
        }
    });
}

async function abrirEquipo(idEquipo) {
    let cliente = await obtenerAmigo();

    for (let i = 0; i < cliente.fichas.length; i++) {
        if (cliente.fichas[i].equipo.id == idEquipo) {
            let url = 'src="' + obtenerCaramelo(cliente.fichas[i].id) + '"';
            let tarjeta = `
                    <div class="cardbox">
                        <div class="card">
                            <div class="cardbody">
                                <img class="cardImgage"`+ url + `alt="Jugador">
                            </div>
                            <div class="back"> 
                            </div>
                        </div>
                    </div>`
            $("#contenidoFichas").append(tarjeta);
        }
    }
    estadoVentana(true);
}

async function obtenerRepetidas() {
    let cliente = await obtenerAmigo();
    let fichas = [];
    let repetida = -1;
    for (let i = 0; i < cliente.fichas.length; i++) {
        fichas.push(cliente.fichas[i].id);
    }
    fichas.sort((a, b) => a - b);
    for (let i = 0; i < fichas.length; i++) {
        if (repetida!=fichas[i]){
            if ((fichas[i]) == (fichas[i - 1])) {
                let repe = 1;
                repetida=fichas[i];
                for(let j = i; j<fichas.length;j++){
                    if((fichas[j]) == (fichas[j - 1])){
                        repe++;
                    }
                }
                let url = 'src="' + obtenerCaramelo(fichas[i]) + '"';
                let tarjeta = `
                        <div class="cardbox">
                            <div class="card">
                                <div class="cardbody">
                                    <img class="cardImgage"`+ url + `alt="Jugador">
                                </div>
                                <div class="back"> 
                                    <h1> X`+ repe + `</h1>
                                </div>
                            </div>  
                        </div>
                        <button id="btnRepetidas" onclick="pedirFicha()" class="btn btn-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" >Solicitar ficha</button>
                        `
                $("#repetidas").append(tarjeta);
            }
        }
    }
}

function pedirFicha(){
    document.getElementById('repetidas').innerHTML = '';
}

function estadoVentana(abrir) {
    if (abrir == true) {
        if (document.getElementById("contenidoFichas").style.display == "none") {
            document.getElementById("contenidoFichas").style.display = "block";
        } else {
            document.getElementById("contenidoFichas").style.display = "none";
            document.getElementById("contenidoFichas").innerHTML = "";
        }
    } else {
        document.getElementById("contenidoFichas").style.display = "none";
        document.getElementById("contenidoFichas").innerHTML = "";
    }
}

function obtenerCaramelo(idFicha) {
    if (idFicha >= 109) {
        return "../../images/ima/" + idFicha + ".png";
    } else {
        return "../../images/ima/" + idFicha + ".jpg";
    }
}

async function obtenerAmigo() {
    return $.ajax({
        url: "/api/Client/" + idAmigo,
        type: "GET",
        datatype: "JSON",
        success: await function (respuesta) { }
    });
}







