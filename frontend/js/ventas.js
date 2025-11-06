const API_PRODUCTOS = "/api/productos";
const API_VENTAS = "/api/ventas";
const API_CLIENTES = "/api/clientes";

let productos = [];
let itemsVenta = [];

// Cargar productos al iniciar la página
window.addEventListener("DOMContentLoaded", async () => {
  // Cargar productos y clientes
  try {
    const [resP, resC] = await Promise.all([fetch(API_PRODUCTOS), fetch(API_CLIENTES)]);
    productos = await resP.json();
    let clientes = await resC.json();
    // clientes endpoint returns { data, page, total } — normalizar a array
    if (clientes && clientes.data) clientes = clientes.data;
    renderProductos();
    renderClientes(clientes);
  } catch (err) {
    document.getElementById('msg').innerText = 'Error al cargar datos: ' + err.message;
  }
});

function renderClientes(clientes) {
  const sel = document.getElementById('cliente_id');
  // Limpiar opciones (deja la primera)
  sel.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
  clientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.nombres || ''} ${c.apellidos || ''}`.trim() || `Cliente ${c.id}`;
    sel.appendChild(opt);
  });
}

// Mostrar productos en la tabla
function renderProductos() {
  const tbody = document.getElementById("tablaProductos");
  tbody.innerHTML = productos.map((p, index) => `
    <tr>
      <td>${p.nombre}</td>
      <td>$${Number(p.precio).toFixed(2)}</td>
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
  if (!cliente_id || itemsVenta.length === 0) {
    document.getElementById("msg").innerText = "Seleccione al menos un producto y cliente.";
    return;
  }

  try {
    const res = await fetch(API_VENTAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // enviar solo cliente_id e items; el backend calcula total y valida stock
      body: JSON.stringify({ cliente_id: parseInt(cliente_id, 10), items: itemsVenta })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en servidor');
    document.getElementById("msg").innerText = "✅ Venta registrada con ID: " + data.venta_id + " — Total: $" + Number(data.total).toFixed(2);
    // Limpiar selecciones y tabla
    document.querySelectorAll('.cantidad-input').forEach(i => i.value = 0);
    actualizarTotal();
  } catch (err) {
    document.getElementById('msg').innerText = '❌ ' + err.message;
  }
});

// utilidad: recargar productos y clientes (se puede exponer en UI si se desea)
async function reloadData() {
  try {
    const [resP, resC] = await Promise.all([fetch(API_PRODUCTOS), fetch(API_CLIENTES)]);
    productos = await resP.json();
    let clientes = await resC.json();
    if (clientes && clientes.data) clientes = clientes.data;
    renderProductos();
    renderClientes(clientes);
  } catch (e) { console.error('reloadData error', e); }
}
