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
    else {
        // Guardar en sessionStorage que el usuario ha iniciado sesión
        sessionStorage.setItem('usuarioLogueado', 'true');
    }

    // Obtener el carrito desde `sessionStorage`
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const continuarPresionado = sessionStorage.getItem('continuarPresionado') === 'true';

    // Obtener la última página visitada
    const ultimaPagina = sessionStorage.getItem('ultimaPagina');

    // Redirigir si el carrito está vacío o si no se ha presionado "Continuar"
    if (carrito.length === 0 || !continuarPresionado) {
        if (ultimaPagina) {
            window.location.href = ultimaPagina; // Redirigir a la última página
        }
        return;
    }

    // Si el carrito tiene productos y el botón "Continuar" fue presionado, redirigir a pagos.html
    window.location.href = 'pagos.html';
});


