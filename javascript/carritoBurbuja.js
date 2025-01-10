// Referencias al DOM
const carritoBurbuja = document.getElementById('carrito-burbuja');
const carritoVentana = document.getElementById('carrito-ventana');
const carritoCantidad = document.getElementById('carrito-cantidad');

// Función para abrir/cerrar la ventana del carrito
carritoBurbuja.addEventListener('click', () => {
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    if (cantidadTotal > 0) {
        carritoVentana.classList.toggle('oculto'); // Mostrar/ocultar ventana
    } else {
        console.log('El carrito está vacío. No se mostrará la ventana del carrito.');
    }
});


// Función para actualizar la cantidad en la burbuja
function actualizarBurbuja() {
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    carritoCantidad.textContent = cantidadTotal;

    // Mostrar/ocultar burbuja dependiendo del carrito
    if (cantidadTotal > 0) {
        carritoBurbuja.style.display = 'flex';
    } else {
        carritoBurbuja.style.display = 'none';
        carritoVentana.classList.add('oculto'); // Ocultar el carrito si está vacío
    }
}

// Función para inicializar la burbuja (solo en pantallas pequeñas)
function inicializarBurbuja() {
    if (window.innerWidth <= 768) {
        carritoBurbuja.style.display = 'flex';
    } else {
        carritoBurbuja.style.display = 'none';
    }
}

// Escuchar cambios de tamaño de pantalla
window.addEventListener('resize', () => {
    inicializarBurbuja();
});

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito(); // Guarda en LocalStorage
    renderCarrito(); // Renderiza el carrito
    actualizarBurbuja(); // Actualiza la burbuja
}

function eliminarProducto(index) {
    carrito.splice(index, 1); // Elimina el producto
    guardarCarrito(); // Guarda en LocalStorage
    renderCarrito(); // Renderiza el carrito
    actualizarBurbuja(); // Actualiza la burbuja
}

// Función para cargar el carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado');
    cargarCarrito(); // Cargar carrito desde LocalStorage
    renderCarrito(); // Renderizar carrito
    actualizarBurbuja(); // Asegurar que la burbuja esté actualizada
    inicializarBurbuja(); // Configurar visibilidad de la burbuja
});

