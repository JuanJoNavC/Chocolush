// Obtener los elementos del DOM
const video = document.getElementById('miVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const durationDisplay = document.getElementById('durationDisplay');
const muteButton = document.getElementById('muteButton');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Verifica que todos los elementos existen antes de asignar eventos
if (
    video &&
    playPauseBtn &&
    progressBar &&
    volumeControl &&
    currentTimeDisplay &&
    durationDisplay &&
    muteButton &&
    rewindBtn &&
    forwardBtn &&
    fullscreenBtn
) {
    // Actualiza la duración del video cuando está cargado
    video.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        durationDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    });

    // Función para reproducir o pausar el vídeo
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>'; // Cambiar a Pause
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fa fa-play"></i>'; // Cambiar a Play
        }
    });

    // Actualizar la barra de progreso y los tiempos
    video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.value = progress;

        // Actualizar el tiempo actual
        let minutes = Math.floor(video.currentTime / 60);
        let seconds = Math.floor(video.currentTime % 60);
        currentTimeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    });

    // Hacer que la barra de progreso sea clickeable para cambiar el tiempo del vídeo
    progressBar.addEventListener('input', () => {
        const newTime = (progressBar.value / 100) * video.duration;
        video.currentTime = newTime;
    });

    // Control de volumen
    volumeControl.addEventListener('input', () => {
        video.volume = volumeControl.value / 100;
        video.muted = video.volume === 0; // Silencia si el volumen es 0
        muteButton.innerHTML = video.muted
            ? '<i class="fa fa-volume-mute"></i>'
            : '<i class="fa fa-volume-up"></i>';
    });

    // Silenciar/Activar sonido con el botón de mute
    muteButton.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
            muteButton.innerHTML = '<i class="fa fa-volume-up"></i>'; // Icono de volumen activado
            volumeControl.value = video.volume * 100; // Actualizar el slider al volumen actual
        } else {
            video.muted = true;
            muteButton.innerHTML = '<i class="fa fa-volume-mute"></i>'; // Icono de volumen silenciado
            volumeControl.value = 0; // Mueve el slider a 0
        }
    });

    // Retroceder 5 segundos
    rewindBtn.addEventListener('click', () => {
        video.currentTime = Math.max(0, video.currentTime - 5);
    });

    // Adelantar 5 segundos
    forwardBtn.addEventListener('click', () => {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });

    // Activar pantalla completa
    fullscreenBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Para Safari
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen(); // Para IE/Edge
        }
    });
} else {
    console.error("Uno o más elementos necesarios no fueron encontrados en el DOM.");
}
