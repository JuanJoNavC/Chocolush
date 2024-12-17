document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form"); // Seleccionar el formulario
    const inputs = form.querySelectorAll("input, select"); // Seleccionar todos los campos (input y select)
    const togglePasswordBtn = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");
    const submitButton = form.querySelector("button[type='submit']"); // Botón de enviar

    // --- Persistir valores en sessionStorage ---
    inputs.forEach((input) => {
        // Rellenar los campos con los valores guardados (si existen)
        const savedValue = sessionStorage.getItem(input.id);
        if (savedValue) {
            input.value = savedValue;
        }

        // Guardar los valores en sessionStorage al escribir
        input.addEventListener("input", () => {
            sessionStorage.setItem(input.id, input.value);
            checkFormCompletion(); // Verificar si todos los campos están completos
        });
    });

    // --- Mostrar/ocultar contraseña ---
    togglePasswordBtn.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordBtn.innerHTML = `<i class="fas fa-eye-slash"></i>`; // Cambiar ícono
        } else {
            passwordInput.type = "password";
            togglePasswordBtn.innerHTML = `<i class="fas fa-eye"></i>`; // Cambiar ícono
        }
    });

    // --- Función para verificar si todos los campos están completos ---
    function checkFormCompletion() {
        // Verificar si todos los campos requeridos están llenos
        const allFilled = Array.from(inputs).every((input) => {
            return input.value.trim() !== "" && !input.disabled; // Verifica que no estén vacíos y no estén deshabilitados
        });

        // Habilitar o deshabilitar el botón de envío
        submitButton.disabled = !allFilled;
    }

    // Llamamos a la función al cargar la página para deshabilitar el botón si los campos están vacíos
    checkFormCompletion();

    // --- Limpiar campos y redirigir al enviar el formulario ---
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        // Limpiar todos los campos
        inputs.forEach((input) => {
            input.value = "";
        });

        // Limpiar sessionStorage
        sessionStorage.clear();

        // Redirigir a la página de inicio de sesión
        window.location.href = "inicioSesion.html";
    });
});
