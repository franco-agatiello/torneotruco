const jugadoresRegistrados = JSON.parse(localStorage.getItem('jugadoresRegistrados')) || ['Fede', 'Nico', 'Tobi', 'Ernes', 'Santi', 'Caño', 'Colo', 'Mati', 'Jero', 'Vega'];
const participantes = JSON.parse(localStorage.getItem('participantes')) || {};
const partidas = JSON.parse(localStorage.getItem('partidas')) || [];
const passwordCorrecta = "trucoargento";
let partidaEditando = null; // Variable para rastrear la partida que se está editando
let indexEliminar = null; // Variable para rastrear la partida que se está eliminando

function guardarDatos() {
    localStorage.setItem('jugadoresRegistrados', JSON.stringify(jugadoresRegistrados));
    localStorage.setItem('participantes', JSON.stringify(participantes));
    localStorage.setItem('partidas', JSON.stringify(partidas));
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
            indexEliminar = null; // Resetear la variable
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
    indexEliminar = null; // Resetear la variable en caso de cancelar la eliminación
    mostrarVista('torneo'); // Vuelve a la vista principal
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
        inicializarParticipantes(); // Inicializar el nuevo jugador
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

    // Si estamos editando una partida, eliminamos las estadísticas anteriores
    if (partidaEditando !== null) {
        const partidaAnterior = partidas[partidaEditando];
        actualizarEstadisticas(partidaAnterior.equipo1, partidaAnterior.puntosEquipo1, partidaAnterior.puntosEquipo1 > partidaAnterior.puntosEquipo2, false);
        actualizarEstadisticas(partidaAnterior.equipo2, partidaAnterior.puntosEquipo2, partidaAnterior.puntosEquipo2 > partidaAnterior.puntosEquipo1, false);
        partidas.splice(partidaEditando, 1); // Eliminar la partida antigua
        partidaEditando = null; // Resetear la variable
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

    inicializarParticipantes(); // Asegurarse de que todos los participantes estén inicializados

    let participantesArray = Object.keys(participantes).map(jugador => ({
        nombre: jugador,
        ...participantes[jugador],
        promedio: (participantes[jugador].puntos / (participantes[jugador].partidas || 1)).toFixed(2) // Evitar división por cero
    }));

    // Ordenar participantes según el criterio seleccionado
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
    partidaEditando = index; // Establecer la partida que estamos editando
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
    indexEliminar = index; // Guardar el índice de la partida que se desea eliminar
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

// Inicializar el formulario y tabla
cambiarFormulario();
inicializarParticipantes(); // Inicializar participantes al cargar la página
actualizarTabla();
actualizarTablaPartidas();
