const API_PRODUCTOS = "/api/productos";
const API_VENTAS = "/api/ventas"; // Puedes crearla después

document.getElementById("btnGenerar").addEventListener("click", generarReporte);

async function generarReporte() {
  const tipo = document.getElementById("tipoReporte").value;
  const contenedor = document.getElementById("resultadoReporte");

  if (tipo === "inventario") {
    const res = await fetch(API_PRODUCTOS);
    const productos = await res.json();
    contenedor.innerHTML = renderInventario(productos);

  } else if (tipo === "ventas") {
    try {
      const res = await fetch(API_VENTAS);
      const ventas = await res.json();
      contenedor.innerHTML = renderVentas(ventas);
    } catch (e) {
      contenedor.innerHTML = "<p>No hay API de ventas implementada aún.</p>";
    }
  }
}

function renderInventario(productos) {
  if (!productos.length) return "<p>No hay productos registrados.</p>";

  return `
    <h3>Reporte de Inventario</h3>
    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Total (Precio x Stock)</th>
        </tr>
      </thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
            <td>$${(p.precio * p.stock).toFixed(2)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
}

function renderVentas(ventas) {
  if (!ventas.length) return "<p>No hay ventas registradas.</p>";

  return `
    <h3>Reporte de Ventas</h3>
    <ul>
      ${ventas.map(v => `<li>Venta #${v.id} - Producto: ${v.producto} - Cantidad: ${v.cantidad} - Total: $${v.total}</li>`).join("")}
    </ul>
  `;
}
