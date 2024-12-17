let productoActual = '';
let descripcionActual = '';
let imagenesActuales = [];
let imagenPrincipal = '';
let precios = {
    "Hamburguesa Florida": 7.00,
    "Parrillada Surtida": 10.99,
    "Seco de Pollo": 3.50,
    "Jugo de Naranja": 1.50,
    "Jugo de Mora": 1.50,
    "Ensalada Frutal Tropical": 3.00,
    "Café Latte Artisanal": 1.99,
    "Infusión de Menta Fresca": 0.99,
    "Club Sándwich con Papas Fritas": 5.99,
    "Empanadas de Carne": 3.99
};

// Abrir el modal con la información del producto
function abrirModal(nombreProducto, descripcion, imagenes) {
    productoActual = nombreProducto;
    descripcionActual = descripcion;
    imagenesActuales = imagenes;

    // Mostrar el modal
    document.getElementById("modal").style.display = "flex";
    
    // Establecer la primera imagen como principal
    imagenPrincipal = imagenes[0];
    document.getElementById("main-img").src = imagenPrincipal;

    // Mostrar la descripción
    document.getElementById("modal-desc").textContent = descripcion;

    // Generar las imágenes en miniatura
    const contenedorMiniaturas = document.getElementById("modal-img-container");
    contenedorMiniaturas.innerHTML = '';
    imagenes.forEach((imgSrc, index) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.className = "modal-img" + (index === 0 ? " active" : "");
        img.onclick = function() {
            seleccionarImagenPrincipal(imgSrc);
        };
        contenedorMiniaturas.appendChild(img);
    });
}

// Cambiar la imagen principal en el modal
function seleccionarImagenPrincipal(src) {
    imagenPrincipal = src;
    document.getElementById("main-img").src = src;

    // Actualizar la clase activa en las miniaturas
    const miniaturas = document.querySelectorAll(".modal-img");
    miniaturas.forEach(img => img.classList.remove("active"));
    document.querySelector(`.modal-img[src="${src}"]`).classList.add("active");
}

// Cerrar el modal
function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

// Comprar producto y añadirlo al carrito
function comprarProducto() {
    const cantidad = parseInt(document.getElementById("cantidad").value); // Obtener la cantidad seleccionada
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    // Obtener información del producto actual
    const nombreProducto = productoActual;
    const imagen = imagenPrincipal;
    const precio = precios[nombreProducto];

    // Notificar al usuario
    alert(`Se añadieron ${cantidad} unidad(es) de "${nombreProducto}" al carrito.`);
    // Añadir al carrito
    agregarAlCarrito(nombreProducto, `$${precio.toFixed(2)}`, imagen, cantidad);

    

    // Cerrar el modal
    cerrarModal();
}
