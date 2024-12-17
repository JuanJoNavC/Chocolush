/*  Ejemplo
//Función
function mifuncion(num1, num2){
    var multi = num1 * num2;
    alert("El resultado de la multiplicación de " + num1 + " por " + num2 + " es: " + multi);
}

//Objeto y constructor
var constructor = function(nombreInicial, anios, auto, anioAuto){
    var objeto = {
        nombre: nombreInicial,
        edad: anios,

        carro: {
            modelo: auto,
            fecha: anioAuto
        },

        cambiarNombre: function(nombreNuevo) {
            this.nombre = nombreNuevo;
        },
        mostrarDatos: function() {
            var mensaje = "Nombre: " + objeto.nombre + "\n" + "Edad: " + objeto.edad + "\n" + "Carro: " + objeto.carro.modelo + "\n" + "Año: " + objeto.carro.fecha; 
            alert(mensaje);
        }
    };
    return objeto;
}

//Objeto sin constructor
var miobjeto = {
    nombre: "Paco",
    edad: 11,

    mostrarNombre: function() {
        alert(this.nombre);
    },

    cambiarNombre: function(nombreNuevo) {
        this.nombre = nombreNuevo;
    }
};

//Creamos objetos a partir de otros objetos
var empleado1 = Object.create(miobjeto);
var empleado2 = Object.create(empleado1);
var empleado3 = Object.create(empleado2);

//Creamos un método para el objeto empleado2
empleado2.mostrarEdad = function() {
    alert(this.edad);
}

//Antes empleado3 se generó a partir de empleado2, por lo tanto hereda el método que creamos antes
empleado3.edad = 24;
empleado3.mostrarEdad();

//Probando la función
mifuncion(3, 5);

//Creando objetos
var persona1 = constructor("Nicolás", 20, "McClaren", 2018);
var persona2 = constructor("Laura", 19, "Toyota", 2015);
var persona3 = constructor("Pedro", 23, "Ford", 2004);

//Mostrando objetos
alert(persona1.nombre + ", " + persona2.nombre + ", " + persona3.nombre);

let productoActual = '';
        let descripcionActual = '';
        let imagenesActuales = [];
        let imagenPrincipal = '';

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

        function seleccionarImagenPrincipal(src) {
            imagenPrincipal = src;
            document.getElementById("main-img").src = src;

            // Actualizar la clase activa en las miniaturas
            const miniaturas = document.querySelectorAll(".modal-img");
            miniaturas.forEach(img => img.classList.remove("active"));
            document.querySelector(`.modal-img[src="${src}"]`).classList.add("active");
        }

        function cerrarModal() {
            document.getElementById("modal").style.display = "none";
        }

        function comprarProducto() {
            const cantidad = document.getElementById("cantidad").value;
            alert("Has comprado " + cantidad + " unidad(es) de " + productoActual);
        }
// Variables para manejar el carrito
let carrito = [];

// Función para agregar producto al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    // Buscar si el producto ya está en el carrito
    const productoExistente = carrito.find((item) => item.nombre === nombre);

    if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agregarlo como nuevo producto
        carrito.push({
            nombre: nombre,
            precio: parseFloat(precio.replace('$', '')),
            cantidad: 1,
            imagen: imagen,
        });
    }
    renderCarrito();
}

// Función para renderizar el contenido del carrito
function renderCarrito() {
    const contenedorCarrito = document.querySelector('.productosCarrito');
    contenedorCarrito.innerHTML = ''; // Limpiar el contenido del carrito

    // Crear los elementos del carrito
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
        contenedorCarrito.innerHTML += productoHTML;
    });

    // Actualizar el subtotal
    actualizarSubtotal();
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    // Si la cantidad llega a 0, eliminar el producto
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    renderCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1); // Eliminar producto por índice
    renderCarrito();
}

// Función para actualizar el subtotal
function actualizarSubtotal() {
    const subtotal = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    document.querySelector('.subtotal span:last-child').textContent = `$${subtotal.toFixed(2)}`;
}

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
*/