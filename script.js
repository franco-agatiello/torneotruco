const jugadoresRegistrados = [];
const participantes = {};
const partidas = [];
const passwordCorrecta = "trucoargento";
let partidaEditando = null;
let indexEliminar = null;

const spreadsheetId = '17iDo6NA2skFUuIxGoBUvnuKQ-w0IvBv5VsX7afbP7aI';

function guardarDatos() {
    saveDataToSheet();
}

function inicializarParticipantes() {
    jugadoresRegistrados.forEach(jugador => {
        if (!participantes[jugador]) {
            participantes[jugador] = { puntos: 0, partidas: 0, ganadas: 0, perdidas: 0 };
        }
    });
}

function mostrarVista(vista) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.remove('active'));

    if (vista === 'torneo') {
        document.getElementById('vistaTorneo').classList.add('active');
        actualizarTabla();
    } else if (vista === 'registroPartidas') {
        document.getElementById('vistaRegistroPartidas').classList.add('active');
        actualizarTablaPartidas();
    } else if (vista === 'gestion') {
        document.getElementById('passwordDialog').style.display = 'block';
    } else if (vista === 'reglamento') {
        document.getElementById('vistaReglamento').classList.add('active');
    } else if (vista === 'nuevaPartida') {
        document.getElementById('vistaNuevaPartida').classList.add('active');
    }
}

function verificarPassword() {
    const inputPassword = document.getElementById('passwordInput').value;
    if (inputPassword === passwordCorrecta) {
        document.getElementById('passwordDialog').style.display = 'none';
        if (indexEliminar !== null) {
            eliminarPartida(indexEliminar);
            indexEliminar = null;
        } else {
            document.getElementById('vistaGestion').classList.add('active');
            actualizarListaJugadores();
        }
    } else {
        document.getElementById('passwordError').style.display = 'block';
    }
}

function ocultarDialogo() {
    document.getElementById('passwordDialog').style.display = 'none';
    indexEliminar = null;
    mostrarVista('torneo');
}

function actualizarListaJugadores() {
    const listaJugadores = document.getElementById('listaJugadores');
    listaJugadores.innerHTML = '';
    jugadoresRegistrados.forEach(jugador => {
        listaJugadores.innerHTML += `<li>${jugador} <button onclick="eliminarJugador('${jugador}')">Eliminar</button></li>`;
    });
}

function cambiarFormulario() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const formularioPartida = document.getElementById('formularioPartida');
    formularioPartida.innerHTML = '';

    const crearSelectJugadores = (id) => {
        let options = jugadoresRegistrados.map(jugador => `<option value="${jugador}">${jugador}</option>`).join('');
        return `<select id="${id}">${options}</select>`;
    };

    if (tipoPartida === '2v2') {
        formularioPartida.innerHTML = `
            <div class="jugador-row">
                <h3>Equipo 1</h3>
                ${crearSelectJugadores('jugador1')}
                ${crearSelectJugadores('jugador2')}
            </div>
            <div class="jugador-row">
                <h3>Equipo 2</h3>
                ${crearSelectJugadores('jugador3')}
                ${crearSelectJugadores('jugador4')}
            </div>
            <div class="jugador-row">
                <h3>Puntuación</h3>
                <input type="number" id="puntosEquipo1" placeholder="Puntos Equipo 1">
                <input type="number" id="puntosEquipo2" placeholder="Puntos Equipo 2">
            </div>
        `;
    } else if (tipoPartida === '3v3') {
        formularioPartida.innerHTML = `
            <div class="jugador-row">
                <h3>Equipo 1</h3>
                ${crearSelectJugadores('jugador1')}
                ${crearSelectJugadores('jugador2')}
                ${crearSelectJugadores('jugador3')}
            </div>
            <div class="jugador-row">
                <h3>Equipo 2</h3>
                ${crearSelectJugadores('jugador4')}
                ${crearSelectJugadores('jugador5')}
                ${crearSelectJugadores('jugador6')}
            </div>
            <div class="jugador-row">
                <h3>Puntuación</h3>
                <input type="number" id="puntosEquipo1" placeholder="Puntos Equipo 1">
                <input type="number" id="puntosEquipo2" placeholder="Puntos Equipo 2">
            </div>
        `;
    }
}

function agregarJugador() {
    const nuevoJugador = document.getElementById('nuevoJugador').value.trim();
    if (nuevoJugador && !jugadoresRegistrados.includes(nuevoJugador)) {
        jugadoresRegistrados.push(nuevoJugador);
        actualizarListaJugadores();
        cambiarFormulario();
        document.getElementById('nuevoJugador').value = '';
        inicializarParticipantes();
        guardarDatos();
    } else {
        alert('Por favor, introduce un nombre válido y no duplicado.');
    }
}

function eliminarJugador(jugador) {
    const index = jugadoresRegistrados.indexOf(jugador);
    if (index > -1) {
        jugadoresRegistrados.splice(index, 1);
        actualizarListaJugadores();
        cambiarFormulario();
        guardarDatos();
    }
}

function registrarPartida() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const lugar = document.getElementById('lugar').value.trim();
    const fecha = document.getElementById('fecha').value;
    const puntosEquipo1 = parseInt(document.getElementById('puntosEquipo1').value);
    const puntosEquipo2 = parseInt(document.getElementById('puntosEquipo2').value);

    if (!lugar || !fecha || isNaN(puntosEquipo1) || isNaN(puntosEquipo2)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const jugadoresEquipo1 = [];
    const jugadoresEquipo2 = [];

    if (tipoPartida === '2v2') {
        for (let i = 1; i <= 2; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo1.push(jugador);
        }
        for (let i = 3; i <= 4; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo2.push(jugador);
        }
    } else if (tipoPartida === '3v3') {
        for (let i = 1; i <= 3; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo1.push(jugador);
        }
        for (let i = 4; i <= 6; i++) {
            const jugador = document.getElementById(`jugador${i}`).value;
            if (!jugador) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }
            jugadoresEquipo2.push(jugador);
        }
    }

    if (partidaEditando !== null) {
        const partidaAnterior = partidas[partidaEditando];
        actualizarEstadisticas(partidaAnterior.equipo1, partidaAnterior.puntosEquipo1, partidaAnterior.puntosEquipo1 > partidaAnterior.puntosEquipo2, false);
        actualizarEstadisticas(partidaAnterior.equipo2, partidaAnterior.puntosEquipo2, partidaAnterior.puntosEquipo2 > partidaAnterior.puntosEquipo1, false);
        partidas.splice(partidaEditando, 1);
        partidaEditando = null;
    }

    const partida = {
        lugar,
        fecha,
        tipoPartida,
        equipo1: jugadoresEquipo1,
        equipo2: jugadoresEquipo2,
        puntosEquipo1,
        puntosEquipo2
    };

    partidas.push(partida);
    actualizarEstadisticas(jugadoresEquipo1, puntosEquipo1, puntosEquipo1 > puntosEquipo2, true);
    actualizarEstadisticas(jugadoresEquipo2, puntosEquipo2, puntosEquipo2 > puntosEquipo1, true);

    actualizarTabla();
    actualizarTablaPartidas();
    limpiarCampos();
    guardarDatos();
}

function actualizarEstadisticas(jugadores, puntos, esGanador, sumar) {
    jugadores.forEach(jugador => {
        if (!participantes[jugador]) {
            participantes[jugador] = { puntos: 0, partidas: 0, ganadas: 0, perdidas: 0 };
        }

        if (sumar) {
            participantes[jugador].puntos += puntos;
            participantes[jugador].partidas += 1;
            if (esGanador) {
                participantes[jugador].ganadas += 1;
            } else {
                participantes[jugador].perdidas += 1;
            }
        } else {
            participantes[jugador].puntos -= puntos;
            participantes[jugador].partidas -= 1;
            if (esGanador) {
                participantes[jugador].ganadas -= 1;
            } else {
                participantes[jugador].perdidas -= 1;
            }
        }
    });
}

function actualizarTabla() {
    const criterioOrden = document.getElementById('criterioOrden').value;
    const tbody = document.querySelector('#tablaGeneral tbody');
    tbody.innerHTML = '';

    inicializarParticipantes();

    let participantesArray = Object.keys(participantes).map(jugador => ({
        nombre: jugador,
        ...participantes[jugador],
        promedio: (participantes[jugador].puntos / (participantes[jugador].partidas || 1)).toFixed(2)
    }));

    if (criterioOrden === 'puntos') {
        participantesArray.sort((a, b) => b.puntos - a.puntos);
    } else if (criterioOrden === 'partidas') {
        participantesArray.sort((a, b) => b.partidas - a.partidas);
    } else {
        participantesArray.sort((a, b) => b.promedio - a.promedio);
    }

    participantesArray.forEach((jugador, index) => {
        const { nombre, puntos, partidas, ganadas, perdidas, promedio } = jugador;
        const fila = `<tr>
            <td>${index + 1}</td>
            <td>${nombre}</td>
            <td>${puntos}</td>
            <td>${partidas}</td>
            <td>${promedio}</td>
            <td>${ganadas}</td>
            <td>${perdidas}</td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function actualizarTablaPartidas() {
    const tbody = document.querySelector('#tablaPartidas tbody');
    tbody.innerHTML = '';

    partidas.forEach((partida, index) => {
        const fila = `<tr>
            <td>${index + 1}</td>
            <td>${partida.lugar}</td>
            <td>${partida.fecha}</td>
            <td>${partida.tipoPartida}</td>
            <td>${partida.equipo1.join(', ')}</td>
            <td>${partida.equipo2.join(', ')}</td>
            <td>${partida.puntosEquipo1}</td>
            <td>${partida.puntosEquipo2}</td>
            <td>
                <button onclick="editarPartida(${index})">Editar</button>
                <button onclick="mostrarDialogoEliminar(${index})">Eliminar</button>
            </td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function editarPartida(index) {
    const partida = partidas[index];
    partidaEditando = index;
    document.getElementById('tipoPartida').value = partida.tipoPartida;
    cambiarFormulario();
    
    for (let i = 0; i < partida.equipo1.length; i++) {
        document.getElementById(`jugador${i + 1}`).value = partida.equipo1[i];
    }
    for (let i = 0; i < partida.equipo2.length; i++) {
        document.getElementById(`jugador${i + 1 + partida.equipo1.length}`).value = partida.equipo2[i];
    }
    document.getElementById('puntosEquipo1').value = partida.puntosEquipo1;
    document.getElementById('puntosEquipo2').value = partida.puntosEquipo2;
    document.getElementById('lugar').value = partida.lugar;
    document.getElementById('fecha').value = partida.fecha;

    mostrarVista('nuevaPartida');
}

function mostrarDialogoEliminar(index) {
    indexEliminar = index;
    document.getElementById('passwordDialog').style.display = 'block';
}

function eliminarPartida(index) {
    const partida = partidas[index];
    actualizarEstadisticas(partida.equipo1, partida.puntosEquipo1, partida.puntosEquipo1 > partida.puntosEquipo2, false);
    actualizarEstadisticas(partida.equipo2, partida.puntosEquipo2, partida.puntosEquipo2 > partida.puntosEquipo1, false);
    partidas.splice(index, 1);
    actualizarTabla();
    actualizarTablaPartidas();
    guardarDatos();
}

function limpiarCampos() {
    const tipoPartida = document.getElementById('tipoPartida').value;
    const numJugadores = tipoPartida === '2v2' ? 4 : 6;

    for (let i = 1; i <= numJugadores; i++) {
        document.getElementById(`jugador${i}`).value = '';
    }
    document.getElementById('puntosEquipo1').value = '';
    document.getElementById('puntosEquipo2').value = '';
    document.getElementById('lugar').value = '';
    document.getElementById('fecha').value = '';
}

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/spreadsheets" })
        .then(() => {
            console.log("Sign-in successful");
            loadClient();
        })
        .catch(err => {
            console.error("Error signing in", err);
        });
}

function loadClient() {
    gapi.client.setApiKey("YOUR_API_KEY");
    return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => {
            console.log("GAPI client loaded for API");
            loadDataFromSheet();
        })
        .catch(err => {
            console.error("Error loading GAPI client for API", err);
        });
}

function loadDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A2:E',
    }).then(response => {
        const data = response.result.values;
        jugadoresRegistrados.push(...data.map(row => row[0]));
        data.forEach(row => {
            participantes[row[0]] = {
                puntos: parseInt(row[1]),
                partidas: parseInt(row[2]),
                ganadas: parseInt(row[3]),
                perdidas: parseInt(row[4])
            };
        });
        actualizarListaJugadores();
        actualizarTabla();
        actualizarTablaPartidas();
    });
}

function saveDataToSheet() {
    const data = jugadoresRegistrados.map(jugador => [
        jugador,
        participantes[jugador].puntos,
        participantes[jugador].partidas,
        participantes[jugador].ganadas,
        participantes[jugador].perdidas
    ]);

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A2:E',
        valueInputOption: 'RAW',
        resource: {
            values: data
        }
    }).then(response => {
        console.log('Data saved to sheet');
    });
}

function init() {
    gapi.load("client:auth2", () => {
        gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" });
    });
}

document.addEventListener("DOMContentLoaded", init);
