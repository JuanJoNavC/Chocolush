$(document).ready(function () {


    const apiBase = "http://backendchocolush.runasp.net/api/Producto";

    function getBrandFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("brand");
    }

    function fetchProductos() {
        const brand = getBrandFromURL();
        const apiUrl = brand ? `${apiBase}/brand?brand=${encodeURIComponent(brand)}` : apiBase;

        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json",
            success: function (productos) {
                renderProductos(productos);
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar productos:", error);
                $(".productos").html("<p>No se pudieron cargar los productos.</p>");
            }
        });
    }

    function renderProductos(productos) {
        let html = "";
        const isMobile = window.matchMedia("(max-width: 767px)").matches; // Ajusta breakpoint según tu diseño

        productos.forEach((prod, index) => {
            if (isMobile) {
                // Formato con background image para móvil
                html += `
            <div class="producto" id="producto${index}" style="background-image: url('${prod.PROD_IMG}'); background-size: cover; background-position: center;">
                <div class="info">
                    <h3>${prod.PROD_NOMBRE}</h3>
                    <p>${prod.PROD_DESCCORTA || prod.PROD_DESC}</p>
                    <p class="precioOrd">$${isNaN(prod.PROD_PRECIO) ? '0.00' : Number(prod.PROD_PRECIO).toFixed(2)}</p>
                </div>
                <div class="icono-mas" 
                    onclick="agregarAlCarrito('${prod.PROD_ID}', '${escapeQuotes(prod.PROD_NOMBRE)}', '$${Number(prod.PROD_PRECIO).toFixed(2)}', '${prod.PROD_IMG}')">
                    <i class="fas fa-plus"></i>
                </div>
            </div>`;
            } else {
                // Formato con etiqueta img para escritorio
                html += `
            <div class="producto" id="producto${index}">
                <div class="info">
                    <h3>${prod.PROD_NOMBRE}</h3>
                    <p>${prod.PROD_DESCCORTA || prod.PROD_DESC}</p>
                    <p class="precioOrd">$${isNaN(prod.PROD_PRECIO) ? '0.00' : Number(prod.PROD_PRECIO).toFixed(2)}</p>
                </div>
                <div class="imagen">
                    <img src="${prod.PROD_IMG}" alt="${escapeQuotes(prod.PROD_NOMBRE)}" />
                </div>
                <div class="icono-mas" 
                    onclick="agregarAlCarrito(${prod.PROD_ID}, '${escapeQuotes(prod.PROD_NOMBRE)}', '$${isNaN(prod.PROD_PRECIO) ? '0.00' : Number(prod.PROD_PRECIO).toFixed(2)}', '${prod.PROD_IMG}', )">
                    <i class="fas fa-plus"></i>
                </div>
            </div>`;
            }
        });

        $(".productos").html(html);
    }




    // Función para escapar comillas simples o dobles en los nombres para que no rompa el onclick
    function escapeQuotes(text) {
        if (!text) return "";
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
    }

    // Lanzar carga de productos al inicio
    fetchProductos();
});


$(document).ready(function () {
    $('#register-form').on('submit', function (e) {
        e.preventDefault(); // Detener el envío normal del formulario

        // Obtener los valores de los campos
        const nombre = $('#nombre').val().trim();
        const apellido = $('#apellido').val().trim();
        const fechaNacimiento = $('#fecha_nacimiento').val();
        const correo = $('#email').val().trim();
        const sexo = $('#sexo').val();
        const direccion = $('#direccion').val().trim();
        const clave = $('#password').val();
        const cedula = $('#cedula').val().trim();
        const telefono = $('#telefono').val().trim();
        const sector = $('#sector').val().trim();

        // Expresiones regulares
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const soloNumeros = /^\d+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validaciones
        if (!nombre || !apellido || !fechaNacimiento || !correo || !sexo || !direccion || !clave || !cedula || !telefono || !sector) {
            alert('Por favor completa todos los campos.');
            return;
        }

        if (!soloLetras.test(nombre)) {
            alert('El nombre solo debe contener letras.');
            return;
        }

        if (!soloLetras.test(apellido)) {
            alert('El apellido solo debe contener letras.');
            return;
        }

        if (!soloLetras.test(sector)) {
            alert('El sector solo debe contener letras.');
            return;
        }

        if (!soloNumeros.test(cedula)) {
            alert('La cédula solo debe contener números.');
            return;
        }

        if (!soloNumeros.test(telefono)) {
            alert('El teléfono solo debe contener números.');
            return;
        }

        if (!emailRegex.test(correo)) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        if (clave.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Si pasa todas las validaciones, construir el objeto
        const clienteData = {
            CLI_NOMBRE: nombre,
            CLI_APELLIDO: apellido,
            CLI_FECHANACIMIENTO: fechaNacimiento,
            CLI_CORREO: correo,
            CLI_SEXO: sexo,
            CLI_DIRECCION: direccion,
            CLI_CLAVE: clave,
            CLI_CEDULA: cedula,
            CLI_TELEFONO: telefono,
            CLI_SECTOR: sector
        };

        // Enviar los datos al backend
        $.ajax({
            url: 'http://backendchocolush.runasp.net/api/Cliente',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(clienteData),
            success: function (response) {
                alert('¡Cliente registrado con éxito!');
                window.location.href = 'inicioSesion.html';
            },
            error: function (xhr, status, error) {
                console.error('Error al registrar:', xhr.responseText);
                alert('Error al registrar cliente. Por favor revisa los datos e inténtalo de nuevo.');
            }
        });
    });
});
