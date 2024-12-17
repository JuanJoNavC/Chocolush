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

// Función para validar número de tarjeta (solo números y longitud de 16)
function validarNumeroTarjeta(numeroTarjeta) {
    const regex = /^\d{16}$/; // Solo permite 16 dígitos
    return regex.test(numeroTarjeta);
}

// Función para validar fecha de expiración en formato MM/AA
function validarFechaExpiracion(fechaExpiracion) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Formato MM/AA
    if (!regex.test(fechaExpiracion)) return false;

    // Validar que la fecha no esté en el pasado
    const [mes, año] = fechaExpiracion.split('/');
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear() % 100; // Últimos 2 dígitos del año
    const mesActual = fechaActual.getMonth() + 1; // Mes actual (0 indexado)

    return año > añoActual || (año == añoActual && mes >= mesActual);
}

// Función para validar CVV (solo números y longitud de 3)
function validarCVV(cvv) {
    const regex = /^\d{3}$/; // Solo permite 3 dígitos
    return regex.test(cvv);
}

// Procesar el pago con validaciones
function procesarPago(event) {
    event.preventDefault();

    const numeroTarjeta = document.getElementById('numero-tarjeta').value.trim();
    const fechaExpiracion = document.getElementById('fecha-expiracion').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Validaciones
    if (!validarNumeroTarjeta(numeroTarjeta)) {
        alert('Número de tarjeta inválido. Debe contener exactamente 16 dígitos.');
        return;
    }

    if (!validarFechaExpiracion(fechaExpiracion)) {
        alert('Fecha de expiración inválida. Asegúrate de usar el formato MM/AA y que la fecha no esté vencida.');
        return;
    }

    if (!validarCVV(cvv)) {
        alert('CVV inválido. Debe contener exactamente 3 dígitos.');
        return;
    }

    alert('Pago procesado exitosamente.');
    // Lógica para enviar los datos al servidor o redirigir al usuario
}
