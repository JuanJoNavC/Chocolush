// Variables para manejar el carrito
let carrito = [];

// Función para agregar producto al carrito
function agregarAlCarrito(nombre, precio, imagen, cantidad = 1) {
    const productoExistente = carrito.find((item) => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad; // Incrementar la cantidad seleccionada
    } else {
        carrito.push({
            nombre: nombre,
            precio: parseFloat(precio.replace('$', '')),
            cantidad: cantidad, // Usar la cantidad seleccionada
            imagen: imagen,
        });
    }
    guardarCarrito(); // Guardar el carrito en LocalStorage
    renderCarrito();
    actualizarBurbuja(); // Actualiza la burbuja (si existe)
}


 // Función para renderizar el contenido del carrito
 function renderCarrito() {
    const contenedoresCarrito = document.querySelectorAll('.productosCarrito');
    const mensajeVacio = "El carrito está vacío...";

    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        contenedoresCarrito.forEach((contenedor) => {
            contenedor.innerHTML = `<p style="text-align: center; font-size: 1.2em; color: gray;">${mensajeVacio}</p>`;
        });
        document.querySelectorAll('.btnContinuar').forEach((boton) => (boton.disabled = true));
    } else {
        contenedoresCarrito.forEach((contenedor) => {
            contenedor.innerHTML = ''; // Limpiar contenido del carrito

            carrito.forEach((producto, index) => {
                const productoHTML = `
                    <div class="productoEspecifico">
                        <div class="fotoProducto">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <div class="detallesProducto">
                            <p><strong>${producto.nombre}</strong></p>
                            <p>$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                            <div class="item-actions">
                                <button class="delete-item" onclick="eliminarProducto(${index})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <div class="quantity-controls">
                                    <button class="decrease-quantity" onclick="cambiarCantidad(${index}, -1)">-</button>
                                    <span>${producto.cantidad}</span>
                                    <button class="increase-quantity" onclick="cambiarCantidad(${index}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                contenedor.innerHTML += productoHTML;
            });
        });
        document.querySelectorAll('.btnContinuar').forEach((boton) => (boton.disabled = false));
    }

    // Actualizar el subtotal
    actualizarSubtotal();
}



// Función para cambiar la cantidad de un producto
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito(); // Guardar el carrito actualizado
    renderCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1); // Eliminar producto por índice
    guardarCarrito(); // Guardar el carrito actualizado
    renderCarrito();
}

// Función para actualizar el subtotal
function actualizarSubtotal() {
    // Calcular subtotal
    const subtotal = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

    // Calcular IVA (15%)
    const iva = subtotal * 0.15;

    // Calcular total
    const total = subtotal + iva;

    // Actualizar valores en todos los resúmenes
    document.querySelectorAll('.subtotal span:last-child').forEach((el) => (el.textContent = `$${subtotal.toFixed(2)}`));
    document.querySelectorAll('.iva span:last-child').forEach((el) => (el.textContent = `$${iva.toFixed(2)}`));
    document.querySelectorAll('.total span:last-child').forEach((el) => (el.textContent = `$${total.toFixed(2)}`));
}



// Función para guardar el carrito en LocalStorage
function guardarCarrito() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para cargar el carrito desde LocalStorage
function cargarCarrito() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado); // Convertir el JSON a un array
        renderCarrito(); // Renderizar el carrito con los datos cargados
    }
}

// Cargar el carrito cuando se carga la página
window.onload = cargarCarrito;

// Asignar eventos a los botones de "más" en los productos
document.querySelectorAll('.icono-mas').forEach((boton, index) => {
    boton.addEventListener('click', () => {
        // Obtener la información del producto
        const productoElemento = document.getElementById(`producto${index}`);
        const nombre = productoElemento.querySelector('.info h3').textContent;
        const precio = productoElemento.querySelector('.precioOrd').textContent;
        const imagen = productoElemento.querySelector('.imagen img').src;

        // Agregar el producto al carrito
        agregarAlCarrito(nombre, precio, imagen);
    });
});

document.querySelectorAll('.btnContinuar').forEach((boton) => {
    boton.addEventListener('click', async () => {
        try {
            // Validar que el carrito no esté vacío
            if (carrito.length === 0) {
                alert('El carrito está vacío. Por favor, agrega productos antes de continuar.');
                return;
            }

            // Enviar el carrito al servidor para validar el stock
            const response = await fetch('/validar-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carrito }), // Enviar el carrito actual
            });

            if (!response.ok) {
                // Manejar errores enviados por el servidor
                const data = await response.json();
                let mensajeError = 'Errores detectados:\n';
                data.errores.forEach((error) => {
                    mensajeError += `${error.producto}: ${error.mensaje}\n`;
                });
                alert(mensajeError);
                return; // Detener el flujo si hay errores
            }

            // Si no hay errores, proceder con la redirección
            const usuarioLogueado = sessionStorage.getItem('usuarioLogueado') === 'true';

            if (usuarioLogueado) {
                // Redirigir directamente a pagos.html si ya inició sesión
                window.location.href = 'pagos.html';
            } else {
                // Redirigir al login si no ha iniciado sesión
                window.location.href = 'inicioSesion.html';
            }
        } catch (error) {
            console.error('Error al validar el stock:', error);
            alert('Error al validar el stock. Por favor, intenta nuevamente.');
        }
    });
});




document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    renderCarrito();
    actualizarBurbuja();
    inicializarBurbuja();
});
