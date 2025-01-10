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
        e.preventDefault(); // Stop form from submitting normally

        const clienteData = {
            CLI_NOMBRE: $('#nombre').val(),
            CLI_APELLIDO: $('#apellido').val(),
            CLI_FECHANACIMIENTO: $('#fecha_nacimiento').val(),
            CLI_CORREO: $('#email').val(),
            CLI_SEXO: $('#sexo').val(),
            CLI_DIRECCION: $('#direccion').val(),
            CLI_CLAVE: $('#password').val(),
            CLI_CEDULA: $('#cedula').val(),
            CLI_TELEFONO: $('#telefono').val(),
            CLI_SECTOR: $('#sector').val()
        };

        $.ajax({
            url: 'http://backendchocolush.runasp.net/api/Cliente',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(clienteData),
            success: function (response) {
                alert('¡Cliente registrado con éxito!');
                // Optional: redirect to login or another page
                window.location.href = 'inicioSesion.html';
            },
            error: function (xhr, status, error) {
                console.error('Error al registrar:', xhr.responseText);
                alert('Error al registrar cliente. Por favor revisa los datos e inténtalo de nuevo.');
            }
        });
    });

    // Toggle password visibility
    $('#toggle-password').on('click', function () {
        const passwordInput = $('#password');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });
});