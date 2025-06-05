// Variables para manejar el carrito
let carrito = [];


// Función para agregar producto al carrito
function agregarAlCarrito(id, nombre, precio, imagen, cantidad = 1) {
    const productoExistente = carrito.find((item) => item.nombre === nombre);
    console.log("nombre del nombre" + id);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            id: id, // <-- Aquí guardas el id
            nombre: nombre,
            precio: parseFloat(precio.replace('$', '')),
            cantidad: cantidad,
            imagen: imagen,
        });
    }
    guardarCarrito(); // <-- Asegúrate que guarda todo el objeto
    renderCarrito();
    actualizarBurbuja();
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



document.querySelectorAll('.btnContinuar').forEach((boton) => {
    boton.addEventListener('click', async () => {
        try {
            // Validar que el carrito no esté vacío
            if (carrito.length === 0) {
                alert('El carrito está vacío. Por favor, agrega productos antes de continuar.');
                return;
            }

            // Obtener los productos con su stock actual desde la API pública
            const response = await fetch('https://backendchocolush.runasp.net/api/Producto', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                alert('No se pudo obtener el stock de productos. Intenta más tarde.');
                return;
            }

            const productosAPI = await response.json();

            // Validar stock para cada producto en el carrito
            let errores = [];
            carrito.forEach(itemCarrito => {
                // Buscar producto en API por nombre (o puedes usar PROD_ID si lo tienes)
                const productoAPI = productosAPI.find(p => p.PROD_NOMBRE === itemCarrito.nombre);
                if (!productoAPI) {
                    errores.push({
                        producto: itemCarrito.nombre,
                        mensaje: 'Producto no encontrado en el inventario.'
                    });
                } else if (itemCarrito.cantidad > productoAPI.PROD_STOCK) {
                    errores.push({
                        producto: itemCarrito.nombre,
                        mensaje: `Stock insuficiente. Disponible: ${productoAPI.PROD_STOCK}, solicitado: ${itemCarrito.cantidad}.`
                    });
                }
            });

            if (errores.length > 0) {
                let mensajeError = 'Errores detectados:\n';
                errores.forEach(error => {
                    mensajeError += `${error.producto}: ${error.mensaje}\n`;
                });
                alert(mensajeError);
                return;
            }

            // Si no hay errores, proceder con la redirección
            const usuarioLogueado = sessionStorage.getItem('usuarioLogueado') === 'true';

            if (usuarioLogueado) {
                window.location.href = 'pagos.html';
            } else {
                // Redirigir a inicioSesion.html agregando query param para mostrar modal
                window.location.href = 'inicioSesion.html?showModal=true';
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
