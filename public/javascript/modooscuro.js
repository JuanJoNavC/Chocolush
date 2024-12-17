// JavaScript para alternar entre modo oscuro y claro

function toggleDarkMode() {
    const body = document.body;
    const link = document.getElementById('oscuro-stylesheet');
    
    // Comprobar si ya está activado el modo oscuro
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode'); // Eliminar clase para modo oscuro
        link.disabled = true; // Desactivar el archivo CSS de modo oscuro
    } else {
        body.classList.add('dark-mode'); // Activar clase para modo oscuro
        link.disabled = false; // Activar el archivo CSS de modo oscuro
    }
    
    // Guardar preferencia en sessionStorage
    sessionStorage.setItem('dark-mode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}

// Al cargar la página, revisar si el usuario tiene preferencia de modo oscuro
window.onload = () => {
    const body = document.body;
    const link = document.getElementById('oscuro-stylesheet');

    if (sessionStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark-mode');
        link.disabled = false;
    } else {
        link.disabled = true;
    }
};
