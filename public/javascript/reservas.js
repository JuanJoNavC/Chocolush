let currentPage = 1;
const reservasPorPagina = 8;


// Función para guardar la reserva en localStorage
function guardarReserva() {
    const mesaSelect = document.getElementById('opciones');
    const horaSelect = document.getElementById('opc');

    const mesa = mesaSelect.options[mesaSelect.selectedIndex].textContent; // Obtiene el texto de la opción
    const hora = horaSelect.options[horaSelect.selectedIndex].textContent; // Obtiene el texto de la opción
    const fechaInput = document.getElementById('fecha').value;

    if (!fechaInput || !hora) {
        alert('Por favor, ingrese la fecha y hora de la reserva.');
        return;
    }

    const fecha = new Date(fechaInput + 'T00:00'); // Asegura la correcta interpretación de la fecha
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const nuevaReserva = {
        fecha: fechaFormateada, // Guardar la fecha formateada directamente
        hora,
        mesa,
        estado: 'Activa',
    };

    const reservas = JSON.parse(sessionStorage.getItem('reservas')) || [];
    reservas.unshift(nuevaReserva); // Agregar la reserva al inicio
    sessionStorage.setItem('reservas', JSON.stringify(reservas));

    alert('¡Reserva realizada con éxito!');
    window.location.href = 'mis_reservas.html'; // Redirigir a "Mis Reservas"
}

// Función para cargar reservas desde localStorage
function cargarReservas() {
    let reservas = JSON.parse(sessionStorage.getItem('reservas')) || [];
    const hoy = new Date(); // Fecha actual

    // Actualizar estado de las reservas pasadas a "Pasada"
    reservas = reservas.map((reserva) => {
        const fechaReserva = new Date(reserva.fecha.split('/').reverse().join('-')); // Convertir fecha
        if (fechaReserva < hoy && reserva.estado === 'Activa') {
            reserva.estado = 'Pasada'; // Cambiar estado a "Pasada"
        }
        return reserva;
    });

    // Guardar los cambios actualizados en localStorage
    sessionStorage.setItem('reservas', JSON.stringify(reservas));

    const contenedorReservas = document.querySelector('.Reservas');
    contenedorReservas.innerHTML = ''; // Limpiar el contenedor

    // Calcular el índice de inicio y fin de las reservas a mostrar
    const inicio = (currentPage - 1) * reservasPorPagina;
    const fin = inicio + reservasPorPagina;
    const reservasPagina = reservas.slice(inicio, fin);

    reservasPagina.forEach((reserva, index) => {
        const globalIndex = reservas.indexOf(reserva); // Usar el índice global correcto
        const fechaReserva = new Date(reserva.fecha.split('/').reverse().join('-')); // Convertir fecha
        const haPasado = fechaReserva < hoy; // Verificar si la fecha ya pasó

        // Determinar la clase CSS según el estado
        let estadoClase = '';
        if (reserva.estado === 'Activa') {
            estadoClase = 'reserva-activa';
        } else if (reserva.estado === 'Cancelada') {
            estadoClase = 'reserva-cancelada';
        } else if (reserva.estado === 'Pasada') {
            estadoClase = 'reserva-pasada';
        }

        const estrellasFijas =
            reserva.calificacion && reserva.calificacion > 0
                ? [...Array(5)]
                      .map(
                          (_, i) =>
                              `<label>${i + 1 <= reserva.calificacion ? '★' : '☆'}</label>`
                      )
                      .join('')
                : '';

        const reservaHTML = `
            <div class="infoReserva ${estadoClase}" data-index="${globalIndex}">
                <h2><strong>Reserva: ${reserva.fecha}</strong></h2>
                <p><strong>Estado: </strong>${reserva.estado}</p>
                <p><strong>Hora: </strong>${reserva.hora}</p>
                <p><strong>Mesa para: </strong>${reserva.mesa}</p>
                ${
                    haPasado && !reserva.calificacion // Mostrar calificación interactiva si la fecha pasó y no está calificada
                        ? `<div class="rating" data-index="${globalIndex}">
                               <input type="radio" id="estrella5-${globalIndex}" name="rating-${globalIndex}" value="5">
                               <label for="estrella5-${globalIndex}">★</label>
                               <input type="radio" id="estrella4-${globalIndex}" name="rating-${globalIndex}" value="4">
                               <label for="estrella4-${globalIndex}">★</label>
                               <input type="radio" id="estrella3-${globalIndex}" name="rating-${globalIndex}" value="3">
                               <label for="estrella3-${globalIndex}">★</label>
                               <input type="radio" id="estrella2-${globalIndex}" name="rating-${globalIndex}" value="2">
                               <label for="estrella2-${globalIndex}">★</label>
                               <input type="radio" id="estrella1-${globalIndex}" name="rating-${globalIndex}" value="1">
                               <label for="estrella1-${globalIndex}">★</label>
                           </div>`
                        : reserva.calificacion // Mostrar calificación bloqueada si ya está asignada
                        ? `<div class="rating fijas">${estrellasFijas}</div>`
                        : reserva.estado === 'Activa' // Mostrar botones si está activa
                        ? `<div class="botonesReservas">
                               <button id="btnEditar" onclick="editarReserva(${globalIndex})">Editar</button>
                               <button id="btnCancelar" onclick="cancelarReserva(${globalIndex})">Cancelar</button>
                           </div>`
                        : '' // No mostrar nada para reservas canceladas
                }
            </div>
        `;
        contenedorReservas.innerHTML += reservaHTML;
    });

    // Mostrar los controles de paginación
    mostrarControlesPaginacion(reservas.length);

    // Agregar eventos para las calificaciones
    agregarEventosCalificacion();
}



function agregarEventosCalificacion() {
    const reservas = JSON.parse(sessionStorage.getItem('reservas')) || [];

    document.querySelectorAll('.rating:not(.fijas)').forEach((ratingElement) => {
        const index = ratingElement.getAttribute('data-index');
        const inputs = ratingElement.querySelectorAll('input');

        inputs.forEach((input) => {
            input.addEventListener('change', (event) => {
                const calificacion = parseInt(event.target.value, 10);
                reservas[index].calificacion = calificacion; // Guardar calificación
                sessionStorage.setItem('reservas', JSON.stringify(reservas));
                cargarReservas(); // Recargar reservas con las estrellas bloqueadas
            });
        });
    });
}


// Función para cancelar una reserva
function cancelarReserva(index) {
    const reservas = JSON.parse(sessionStorage.getItem('reservas')) || [];
    reservas[index].estado = 'Cancelada';
    sessionStorage.setItem('reservas', JSON.stringify(reservas));
    cargarReservas();
}

// Función para editar una reserva
function editarReserva(index) {
    const reservas = JSON.parse(sessionStorage.getItem('reservas')) || [];
    const reserva = reservas[index];

    const nuevaFecha = prompt('Nueva fecha (yyyy-mm-dd):', reserva.fecha);
    const nuevaHora = prompt('Nueva hora (hh:mm):', reserva.hora);

    if (nuevaFecha) {
        const fecha = new Date(nuevaFecha + 'T00:00');
        reserva.fecha = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    if (nuevaHora) reserva.hora = nuevaHora;

    sessionStorage.setItem('reservas', JSON.stringify(reservas));
    cargarReservas();
}

function mostrarControlesPaginacion(totalReservas) {
    const contenedorPaginacion = document.querySelector('.paginacion');
    contenedorPaginacion.innerHTML = ''; // Limpiar los controles de paginación

    const totalPaginas = Math.ceil(totalReservas / reservasPorPagina);

    for (let i = 1; i <= totalPaginas ; i++) {
        const botonPagina = document.createElement('button');
        botonPagina.textContent = i;
        botonPagina.classList.add('btn-pagina');
        if (i === currentPage) {
            botonPagina.classList.add('activo'); // Resaltar la página actual
        }
        botonPagina.addEventListener('click', () => {
            currentPage = i;
            cargarReservas();
        });
        contenedorPaginacion.appendChild(botonPagina);
    }
}


// Cargar reservas automáticamente al abrir "Mis Reservas"
if (window.location.pathname.includes('mis_reservas')) {
    cargarReservas();
}

// Función para limpiar todas las reservas
function limpiarReservas() {
    const confirmar = confirm('¿Estás seguro de que deseas limpiar todo el historial de reservas?');
    if (confirmar) {
        sessionStorage.removeItem('reservas'); // Elimina todas las reservas del localStorage
        alert('¡Historial de reservas eliminado con éxito!');
        cargarReservas(); // Recarga las reservas para mostrar una lista vacía
    }
}

// Agregar evento al botón "Limpiar Historial"
document.getElementById('btnLimpiarReservas').addEventListener('click', limpiarReservas);

