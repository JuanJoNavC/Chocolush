// Renderizar el carrito en la página de pago
document.addEventListener('DOMContentLoaded', () => {
    renderCarrito();

    // Asegurarnos de que el campo de dirección esté visible al cargar la página
    const direccionEntregaCheckbox = document.getElementById('direccion-entrega');
    const direccionOtros = document.getElementById('direccion-otros');

    // Si el checkbox está desmarcado, el campo de dirección debe ser visible
    if (!direccionEntregaCheckbox.checked) {
        direccionOtros.style.display = 'flex';
    }

    // Lógica para manejar el checkbox y mostrar/ocultar el campo de dirección de entrega
    direccionEntregaCheckbox.addEventListener('change', function () {
        if (direccionEntregaCheckbox.checked) {
            // Ocultar el campo de dirección
            direccionOtros.style.display = 'none';
        } else {
            // Mostrar el campo de dirección
            direccionOtros.style.display = 'flex';
        }
    });
});

const APIBAnco = 'http://mibanca.runasp.net/api/cuentas'; // URL de la API del banco
const APICompra = 'http://backendchocolush.runasp.net/api/integracion/compra'
const APIClienteDTO = 'http://backendchocolush.runasp.net/api/DTOCliente/correo?correo='; // URL de la API para obtener el cliente por correo
const APICompraInterna = 'http://backendchocolush.runasp.net/api/integracion/confirmarCompraInterna';
const APIUltimaFactura = 'http://backendchocolush.runasp.net/api/Factura/ultimaFactura'; // URL de la API para obtener la última factura

// Función para validar número de tarjeta (solo números y longitud de 16)
function validarCuenta(numeroCuenta, callback) {
    $.ajax({
        url: `${APIBAnco}/${numeroCuenta}`,
        method: 'GET',
        success: function (data) {
            if (data) {
                // Si la cuenta es válida, procesar el pago
                callback();
            } else {
                alert('Número de cuenta inválido o no existe.');
            }
        },
        error: function () {
            alert('Error al validar el número de cuenta. Por favor, intenta nuevamente.');
        }
    });
}



// Procesar el pago con validaciones
async function procesarPago(event) {
    event.preventDefault();

    const numeroCuenta = document.getElementById('numero-cuenta').value.trim();
    /*{
        "carrito": {
            "productos": [
                {
                    "idProducto": 1,
                    "cantidad": 2
                },
                {
                    "idProducto": 2,
                    "cantidad": 2
                }
            ]
        },
        "direccion": "Calle Falsa 123, Ciudad",
            "metodoPago": "Tarjeta de Crédito",
                "cliente": {
            "cliCedula": "1726499757",
                "cliNombre": "Nicolás",
                    "cliApellido": "Guevara",
                        "cliTelefono": "0985423365"
        }
    }*/

    validarCuenta(numeroCuenta, function () {
        // Aquí va el resto del código para procesar el pago
        alert("Cuenta válida. Procesando pago...");
        const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

        const cliente = JSON.parse(sessionStorage.getItem('cliente')) || {};
        console.log('Cliente:', cliente.email);

        $.ajax({
            method: 'GET',
            url: `${APIClienteDTO}${cliente.email}`,
            success: function (data) {
                console.log('Cliente obtenido:', data);
                realizarCompra(data, carrito, numeroCuenta);
            },
            error: function () {
                alert('Error al obtener el cliente. Por favor, intenta nuevamente.');
            }
        })
    });
    function realizarCompra(cliente, carrito, numeroCuenta = 119) {
        const direccionEntrega = document.getElementById('direccion-entrega');
        const metodoPago = "Transferencia Bancaria";


        const carritoCompra = {
            carrito: {
                productos: carrito.map(item => ({
                    idProducto: item.id,
                    cantidad: item.cantidad
                })),
            },
            direccion: direccionEntrega.checked ? "Entrega en dirección registrada" : document.getElementById('direccion-otros').value,
            metodoPago: metodoPago,
            cliente: {
                cliCedula: cliente.cliCedula,
                cliNombre: cliente.cliNombre,
                cliApellido: cliente.cliApellido,
                cliTelefono: cliente.cliTelefono
            }
        };
        console.log(JSON.stringify(carritoCompra, null, 2));

        $.ajax({
            url: APICompra,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(carritoCompra),
            success: function (response) {
                alert('Pago procesado exitosamente. ¡Gracias por tu compra!');
                sessionStorage.removeItem('carrito'); // Limpiar el carrito después de la compra
                /*window.location.href = '/inicio.html';*/

                /*Para ver el numero de esta ultima factura*/
                setTimeout(() => {
                    $.ajax({
                        url: APIUltimaFactura,
                        method: 'GET',
                        success: function (response) {
                            console.log('Última factura obtenida:', response);
                            const ultimaFactura = response;
                            confirmarCompraInterna(ultimaFactura, numeroCuenta);
                        },
                        error: function (xhr) {
                            console.error('Error al obtener la última factura:', xhr.responseText);
                            alert('Error al obtener la última factura. Por favor, intenta nuevamente.');
                        }
                    });
                }, 1000);
            },
            error: function (xhr) {
                console.error('Error al procesar el pago:', xhr.responseText);
                alert('Error al procesar el pago. Por favor, intenta nuevamente.');
            }
        });

    }

    function confirmarCompraInterna(idFactura, cuenta) {
        const infoCompraInterna = {
            idFactura: idFactura,
            cuenta: cuenta,
        };

        console.log('Información de compra interna:', infoCompraInterna);

        $.ajax({
            url: `${APICompraInterna}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(infoCompraInterna),
            success: function (response) {
                console.log('Compra interna procesada exitosamente:', response);
                alert('Compra interna pagada exitosamente. ¡Gracias por tu dinero!');
            },
            error: function (xhr) {
                console.error('Error al procesar la compra interna:', xhr.responseText);
                alert('Error al procesar la compra interna. Por favor, intenta nuevamente.');
            }
        });
    }




}

