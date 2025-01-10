
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const showModal = urlParams.get('showModal');

    if (showModal === 'true') {
        const modal = document.getElementById('loginModal');
        modal.style.display = 'flex';

        document.getElementById('modalCloseBtn').onclick = () => {
            modal.style.display = 'none';

            // Opcional: quitar query param de la URL sin recargar la página
            history.replaceState(null, '', window.location.pathname);
        };

        // Cerrar modal si se da clic fuera del contenido
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                history.replaceState(null, '', window.location.pathname);
            }
        };
    }
});