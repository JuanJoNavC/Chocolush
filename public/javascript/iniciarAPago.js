document.querySelector('.login-form').addEventListener('submit', (event) => {
    // Prevenir el envío predeterminado del formulario
    event.preventDefault();

    // Obtener los valores de los campos
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Validar si los campos están llenos
    if (!emailInput.value.trim() || !passwordInput.value.trim()) {
        alert('Por favor, completa todos los campos antes de continuar.');
        return;
    }

    // Enviar las credenciales al backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
        }),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Correo o contraseña incorrectos');
        }
    })
    .then((data) => {
        alert(data.message); // Mensaje de éxito

        // Guardar información del cliente en sessionStorage (opcional)
        sessionStorage.setItem('cliente', JSON.stringify(data.cliente));
        sessionStorage.setItem('usuarioLogueado', 'true');

        // Redirigir según el carrito o la última página visitada
        const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
        const continuarPresionado = sessionStorage.getItem('continuarPresionado') === 'true';
        const ultimaPagina = sessionStorage.getItem('ultimaPagina');

        if (carrito.length === 0 || !continuarPresionado) {
            if (ultimaPagina) {
                window.location.href = ultimaPagina; // Redirigir a la última página
            } else {
                window.location.href = 'inicio.html'; // Página por defecto si no hay última página
            }
        } else {
            // Si el carrito tiene productos y se presionó "Continuar", redirigir a pagos.html
            window.location.href = 'pagos.html';
        }
    })
    .catch((error) => {
        alert(error.message); // Mostrar error
    });
});
