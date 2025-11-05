// facturacion.js

const apiURL = "/api/factura"; // Cambiar si tu backend no corre en la misma ruta

document.addEventListener("DOMContentLoaded", () => {
  cargarFacturas();

  document.getElementById("cerrarDetalle").addEventListener("click", () => {
    document.getElementById("detalleFactura").style.display = "none";
  });
});

// Cargar listado de facturas
async function cargarFacturas() {
  const res = await fetch(`${apiURL}/ventas`);
  const data = await res.json();

  const tbody = document.querySelector("#tablaFacturas tbody");
  tbody.innerHTML = "";

  data.forEach(factura => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${factura.id}</td>
      <td>${factura.cliente_nombre || "Sin cliente"}</td>
      <td>${new Date(factura.fecha).toLocaleString()}</td>
      <td>${factura.total}</td>
      <td>
        <button onclick="verDetalle(${factura.id})">Ver</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Ver detalles de una factura
async function verDetalle(id) {
  const res = await fetch(`${apiURL}/ventas/${id}`);
  const data = await res.json();

  document.getElementById("detFacturaId").innerText = data.id;
  document.getElementById("detCliente").innerText = data.cliente_nombre || "Consumidor final";
  document.getElementById("detFecha").innerText = new Date(data.fecha).toLocaleString();
  document.getElementById("detTotal").innerText = data.total;

  const itemsBody = document.getElementById("detItems");
  itemsBody.innerHTML = "";

  data.items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>${item.precio}</td>
    `;
    itemsBody.appendChild(tr);
  });

  document.getElementById("detalleFactura").style.display = "block";
}
