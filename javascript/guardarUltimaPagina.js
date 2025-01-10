// Guardar la última página visitada
if (document.referrer && !sessionStorage.getItem('ultimaPagina')) {
    sessionStorage.setItem('ultimaPagina', document.referrer); // Página previa desde donde llegaste aquí
} else {
    sessionStorage.setItem('ultimaPagina', window.location.href); // Página actual
}
