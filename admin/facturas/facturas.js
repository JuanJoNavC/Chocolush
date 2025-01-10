const apiFacturaUrl = 'http://backendchocolush.runasp.net/api/Factura';
const apiProFacUrl = 'http://backendchocolush.runasp.net/api/DTOProFac';
const apiDTOFactiuras = 'http://backendchocolush.runasp.net/api/DTOFactura/facturas';

const params = new URLSearchParams(window.location.search);
const facId = params.get('id');


// Cargar todas las facturas y mostrarlas en tabla
$(document).ready(() => {
  $.get(apiDTOFactiuras, function (facturas) {
    facturas.forEach(fac => {
      $('#facturas-table tbody').append(`
            <tr>
              <td>${fac.idFactura}</td>
              <td>${fac.cliNombre}</td>
              <td>${fac.cliCedula}</td>
              <td>${fac.facDescripcion}</td>
              <td>${new Date(fac.facFechaHora).toLocaleString()}</td>
              <td>$${fac.facSubtotal.toFixed(2)}</td>
              <td>$${fac.facIva.toFixed(2)}</td>
              <td>${fac.facEstado}</td>
              <td><a href="detail.html?id=${fac.idFactura}" class="btn-detalle">Ver detalle</a></td>
            </tr>
          `);
    });
  });
});

// Cargar datos factura
$.get(`${apiDTOFactiuras}/${facId}`, function (fac) {
  $('#factura-info').html(`
        <p><strong>ID:</strong> ${fac.idFactura}</p>
        <p><strong>Cliente:</strong> ${fac.cliNombre}</p>
        <p><strong>Cedula:</strong> ${fac.cliCedula}</p>
        <p><strong>Descripción:</strong> ${fac.facDescripcion}</p>
        <p><strong>Fecha y Hora:</strong> ${new Date(fac.facFechaHora).toLocaleString()}</p>
        <p><strong>Subtotal:</strong> $${fac.facSubtotal.toFixed(2)}</p>
        <p><strong>IVA:</strong> $${fac.facIva.toFixed(2)}</p>
        <p><strong>Estado:</strong> ${fac.facEstado}</p>
      `);
});

// Cargar productos asociados
$.get(`${apiProFacUrl}/${facId}`, function (detalles) {
  detalles.forEach(det => {
    $('#detalle-table tbody').append(`
          <tr>
            <td>${det.idProducto}</td>
            <td>${det.prodNombre}</td>
            <td>${det.prodCantidad}</td>
            <td>${det.prodPrecioTotal.toFixed(2)}</td>
            <td>${det.pfEstado}</td>
          </tr>
        `);
  });
});
