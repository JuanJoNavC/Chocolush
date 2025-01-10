const apiUrl = 'http://backendchocolush.runasp.net/api/Cliente';

// Cargar clientes (Read)
if (window.location.pathname.includes('index.html')) {
    $(document).ready(() => {
        $.get(apiUrl, function (clientes) {
            clientes.forEach(cliente => {
                $('#clientes-table tbody').append(`
  <tr>
    <td>${cliente.CLI_ID}</td>
    <td>${cliente.CLI_NOMBRE} ${cliente.CLI_APELLIDO}</td>
    <td>${cliente.CLI_CORREO}</td>
    <td>
      <a href="edit.html?id=${cliente.CLI_ID}"><i class="fas fa-edit"></i></a>
      <a href="#" onclick="deleteCliente(${cliente.CLI_ID})"><i class="fas fa-trash-alt" style="color:red"></i></a>
    </td>
  </tr>`);
            });
        });
    });
}

// Crear cliente
if (window.location.pathname.includes('create.html')) {
    $('#form-create').on('submit', function (e) {
        e.preventDefault();
        const data = formToJson($(this));
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: () => window.location.href = 'index.html',
            error: xhr => alert('Error al crear cliente: ' + xhr.responseText)
        });
    });
}

// Cargar cliente en editar
if (window.location.pathname.includes('edit.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    $.get(`${apiUrl}/${id}`, function (cliente) {
        Object.entries(cliente).forEach(([key, value]) => {
            $(`#form-edit [name=${key}]`).val(value);
        });
    });

    $('#form-edit').on('submit', function (e) {
        e.preventDefault();
        const data = formToJson($(this));
        $.ajax({
            url: apiUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: () => window.location.href = 'index.html',
            error: xhr => alert('Error al actualizar cliente: ' + xhr.responseText)
        });
    });
}

// Eliminar cliente
function deleteCliente(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'DELETE',
            success: () => location.reload(),
            error: xhr => alert('Error al eliminar: ' + xhr.responseText)
        });
    }
}

// Utilidad para convertir form a JSON
function formToJson($form) {
    const data = {};
    $form.serializeArray().forEach(input => {
        data[input.name] = input.value;
    });
    return data;
}
