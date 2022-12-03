
let idClient = localStorage.getItem("idClient");

iniciar()

async function iniciar() {
    cliente = await obtenerCliente();
    document.getElementById("nombre").innerHTML = cliente.name;
}

async function abrirEquipo(idEquipo) {
    let cliente = await obtenerCliente();

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
    let cliente = await obtenerCliente();
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
                        </div>`
                $("#repetidas").append(tarjeta);
            }
        }
    }
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

async function obtenerCliente() {
    return $.ajax({
        url: "/api/Client/" + idClient,
        type: "GET",
        datatype: "JSON",
        success: await function (respuesta) { }
    });
}







