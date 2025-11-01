const API_PRODUCTOS = "/api/productos";
const API_VENTAS = "/api/ventas";

let productos = [];
let itemsVenta = [];

// Cargar productos al iniciar la página
window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(API_PRODUCTOS);
  productos = await res.json();
  renderProductos();
});

// Mostrar productos en la tabla
function renderProductos() {
  const tbody = document.getElementById("tablaProductos");
  tbody.innerHTML = productos.map((p, index) => `
    <tr>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>${p.stock}</td>
      <td>
        <input type="number" min="0" max="${p.stock}" value="0" data-index="${index}" class="cantidad-input">
      </td>
    </tr>
  `).join("");

  // Escuchar cambios de cantidad
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("input", actualizarTotal);
  });
}

// Calcular total de la venta
function actualizarTotal() {
  itemsVenta = [];
  let total = 0;

  document.querySelectorAll(".cantidad-input").forEach(input => {
    const index = input.getAttribute("data-index");
    const cantidad = parseInt(input.value) || 0;

    if (cantidad > 0) {
      const producto = productos[index];
      total += cantidad * producto.precio;
      itemsVenta.push({
        producto_id: producto.id,
        cantidad,
        precio: producto.precio
      });
    }
  });

  document.getElementById("totalVenta").innerText = total.toFixed(2);
}

// Registrar la venta
document.getElementById("btnRegistrarVenta").addEventListener("click", async () => {
  const cliente_id = document.getElementById("cliente_id").value;
  const total = parseFloat(document.getElementById("totalVenta").innerText);

  if (!cliente_id || itemsVenta.length === 0) {
    document.getElementById("msg").innerText = "Seleccione al menos un producto y cliente.";
    return;
  }

  const res = await fetch(API_VENTAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente_id, total, items: itemsVenta })
  });

  const data = await res.json();
  document.getElementById("msg").innerText = "Venta registrada con ID: " + data.id;
});
