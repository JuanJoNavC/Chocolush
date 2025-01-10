document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const offcanvasMenu = document.getElementById('offcanvasMenu');
    const offcanvasOverlay = document.getElementById('offcanvasOverlay');

    function toggleMenu() {
        offcanvasMenu.classList.toggle('open');
        offcanvasOverlay.classList.toggle('visible');
    }

    hamburger.addEventListener('click', toggleMenu);
    offcanvasOverlay.addEventListener('click', toggleMenu);
});
