document.querySelector('.login-button').addEventListener('click', async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput.value.trim() || !passwordInput.value.trim()) {
        alert('Por favor, completa todos los campos antes de continuar.');
        return;
    }

    try {
        // 1. Consultar la API para obtener la contraseña almacenada
        const correo = encodeURIComponent(emailInput.value.trim());
        const response = await fetch(`https://backendchocolush.runasp.net/api/cliente/correo?correo=${correo}`);

        if (!response.ok) {
            throw new Error('Error al consultar el usuario.');
        }
        let passwordFromApi = await response.text(); // Example: "\"juan123\""

        // Remove leading and trailing double quotes if present
        passwordFromApi = passwordFromApi.trim();
        if (passwordFromApi.startsWith('"') && passwordFromApi.endsWith('"')) {
            passwordFromApi = passwordFromApi.slice(1, -1);
        }
        /*alert("BD Contraseña de " + correo + " es " + passwordFromApi);
        alert("Input Contraseña de " + correo + " es " + passwordInput.value);*/

        // 2. Validar si el usuario existe
        if (!passwordFromApi || passwordFromApi.toLowerCase() === 'null' || passwordFromApi === '') {
            alert('Usuario no existe. Por favor verifica el correo.');
            return;
        }

        // 3. Validar que la contraseña ingresada coincida con la de la API
        if (passwordInput.value.trim() !== passwordFromApi.trim()) {
            alert('Contraseña incorrecta.');
            return;
        }

        // 4. Si todo está bien, marcar usuario como logueado y continuar
        alert('Inicio de sesión exitoso.');

        sessionStorage.setItem('cliente', JSON.stringify({ email: emailInput.value.trim() }));
        sessionStorage.setItem('usuarioLogueado', 'true');

        // 5. Manejar redirección según carrito, continuarPresionado y última página
        const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
        const continuarPresionado = sessionStorage.getItem('continuarPresionado') === 'true';
        const ultimaPagina = sessionStorage.getItem('ultimaPagina');

        if (carrito.length === 0 || !continuarPresionado) {
            if (emailInput.value.trim().toLowerCase() === "admin@gmail.com") {
                window.location.href = '../admin/index.html';
            }
            else if (ultimaPagina) {
                window.location.href = ultimaPagina;
            } else {
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'pagos.html';
        }

    } catch (error) {
        alert(error.message);
    }
});
