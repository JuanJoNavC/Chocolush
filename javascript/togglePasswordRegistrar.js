// Seleccionar elementos
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('password');
const toggleIcon = togglePasswordButton.querySelector('i');

// Verificar que los elementos existan antes de añadir eventos
if (passwordInput && togglePasswordButton && toggleIcon) {
    // Agregar evento de clic al botón
    togglePasswordButton.addEventListener('click', () => {
        // Cambiar el tipo de input entre "password" y "text"
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'; // Mostrar contraseña
            toggleIcon.classList.remove('fa-eye'); // Cambiar icono
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password'; // Ocultar contraseña
            toggleIcon.classList.remove('fa-eye-slash'); // Cambiar icono
            toggleIcon.classList.add('fa-eye');
        }
    });
} else {
    console.error('Uno o más elementos necesarios no fueron encontrados en el DOM.');
}
