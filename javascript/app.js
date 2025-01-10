const form=document.getElementById('register-form');

form.addEventListener('submit', function(event){
event.preventDefault();

const nombre = form.elements['nombre'].value;
const apellido = form.elements['apellido'].value;
const fechaNacimiento = form.elements['fecha_nacimiento'].value;
const email = form.elements['email'].value;
const sexo = form.elements['sexo'].value;
const direccion = form.elements['direccion'].value;
const password = form.elements['password'].value;
const cedula = form.elements['cedula'].value;
const telefono = form.elements['telefono'].value;
const sector = form.elements['sector'].value;

if(!nombre.trim() || !apellido.trim() || !direccion.trim()){
    alert('Ingresa un valor válido');
    return;
}
if(!email.includes('@')){
    alert('Por favor ingresa un mail válido');
    return;
}
if (cedula.length !== 10 || isNaN(cedula)) {
    alert('Por favor, ingresa una cédula válida (10 dígitos).');
    return;
}

//ENVIAR DATOS A TRAVÉS DE FETCH API
fetch('/submit',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body: JSON.stringify({
        nombre,
        apellido,
        fecha_nacimiento: fechaNacimiento,
        email,
        sexo,
        direccion,
        password,
        cedula,
        telefono,
        sector,
    }),
})
.then(response =>response.json())
.then(data=>{
    alert('Registro exitoso: : ' +data.message); // cuando convierto un texto a json se llama serializar
})
.catch(error=>{
    console.error('Error:',error);
    alert('Fallo al enviar el formulario de registro');
});
});

document.querySelectorAll('.btnContinuar').forEach((boton) => {
    boton.addEventListener('click', async () => {
        try {
            if (carrito.length === 0) {
                alert('El carrito está vacío. Por favor, agrega productos antes de continuar.');
                return;
            }

            const response = await fetch('/validar-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carrito }),
            });

            if (!response.ok) {
                const data = await response.json();
                let mensajeError = 'Errores detectados:\n';
                data.errores.forEach((error) => {
                    mensajeError += `${error.producto}: ${error.mensaje}\n`;
                });
                alert(mensajeError);
                return;
            }

            const usuarioLogueado = sessionStorage.getItem('usuarioLogueado') === 'true';

            if (usuarioLogueado) {
                window.location.href = 'pagos.html';
            } else {
                window.location.href = 'inicioSesion.html';
            }
        } catch (error) {
            console.error('Error al validar el stock:', error);
            alert('Error al validar el stock. Por favor, intenta nuevamente.');
        }
    });
});

