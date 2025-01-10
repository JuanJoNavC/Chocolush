const apiUrl = 'http://backendchocolush.runasp.net/api/Producto';

// Listar productos
if (window.location.pathname.includes('index.html')) {
    $(document).ready(() => {
        $.get(apiUrl, function (productos) {
            productos.forEach(prod => {
                $('#productos-table tbody').append(`
    <tr>
      <td>${prod.PROD_ID}</td>
      <td>${prod.PROD_NOMBRE}</td>
      <td>$${isNaN(prod.PROD_PRECIO) ? '0.00' : Number(prod.PROD_PRECIO).toFixed(2)}</td>
      <td>${prod.PROD_STOCK}</td>
      <td>${prod.PROD_CATEGORIA}</td>
      <td><img src="${prod.PROD_IMG}" alt="${prod.PROD_NOMBRE}" style="height: 60px; object-fit: contain;"></td>
      <td>
        <a href="edit.html?id=${prod.PROD_ID}" title="Editar"><i class="fas fa-edit"></i></a>
        <a href="#" onclick="deleteProducto(${prod.PROD_ID})" title="Eliminar"><i class="fas fa-trash-alt" style="color:red"></i></a>
      </td>
    </tr>
  `);
            });

        });
    });
}

// Crear producto
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
            error: xhr => alert('Error al crear producto: ' + xhr.responseText)
        });
    });
}

// Cargar producto para editar
if (window.location.pathname.includes('edit.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    $.get(`${apiUrl}/${id}`, function (prod) {
        Object.entries(prod).forEach(([key, value]) => {
            $(`#form-edit [name=${key}]`).val(value);
        });
    });

    $('#form-edit').on('submit', function (e) {
        e.preventDefault();
        const data = formToJson($(this));
        $.ajax({
            url: apiUrl + `/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: () => window.location.href = 'index.html',
            error: xhr => alert('Error al actualizar producto: ' + xhr.responseText)
        });
    });
}

// Eliminar producto
function deleteProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'DELETE',
            success: () => location.reload(),
            error: xhr => alert('Error al eliminar producto: ' + xhr.responseText)
        });
    }
}

// Helper: Formulario a JSON
function formToJson($form) {
    const data = {};
    $form.serializeArray().forEach(input => {
        data[input.name] = input.value;
    });
    return data;
}
