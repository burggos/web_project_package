const API_INVENTARIO = "/api/inventario";
const API_PRODUCTOS = "/api/productos";

async function loadInventario() {
  try {
    const [resInv, resProd] = await Promise.all([fetch(API_INVENTARIO), fetch(API_PRODUCTOS)]);
    const inventario = await resInv.json();
    const productos = await resProd.json();

    const div = document.getElementById("list");
    if (!inventario || inventario.length === 0) {
      div.innerHTML = "<p>No hay productos en inventario.</p>";
      return;
    }

    div.innerHTML = `
      <table class="w-full border text-sm text-left">
        <thead class="bg-gray-100"><tr><th class="p-2 border">ID</th><th class="p-2 border">Producto</th><th class="p-2 border">Precio</th><th class="p-2 border">Cantidad</th><th class="p-2 border">Acciones</th></tr></thead>
        <tbody>
          ${inventario.map(row => `
            <tr>
              <td class="p-2 border">${row.id}</td>
              <td class="p-2 border">${row.nombre}</td>
              <td class="p-2 border">$${Number(row.precio).toFixed(2)}</td>
              <td class="p-2 border" data-inv-id="${row.id}">${row.cantidad}</td>
              <td class="p-2 border"><button data-id="${row.id}" class="decrement bg-red-600 text-white px-2 py-1 rounded">-</button> <button data-id="${row.id}" class="increment bg-green-600 text-white px-2 py-1 rounded">+</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    `;

    // attach handlers
    document.querySelectorAll('.increment').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await changeCantidad(id, 1);
      });
    });
    document.querySelectorAll('.decrement').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await changeCantidad(id, -1);
      });
    });

    // populate product select for adding to inventory
    const select = document.getElementById('producto_select');
    if (select) {
      select.innerHTML = '<option value="">Seleccionar producto</option>' + productos.map(p => `<option value="${p.id}">${p.nombre} ($${Number(p.precio).toFixed(2)})</option>`).join('');
    }
  } catch (err) {
    console.error('Error loading inventario', err);
  }
}

async function changeCantidad(invId, delta) {
  try {
    const cell = document.querySelector(`[data-inv-id='${invId}']`);
    let current = parseInt(cell.innerText, 10) || 0;
    const nueva = Math.max(0, current + delta);
    const res = await fetch(API_INVENTARIO + '/' + invId, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cantidad: nueva })
    });
    if (!res.ok) throw new Error('No se pudo actualizar');
    cell.innerText = nueva;
  } catch (err) { alert('Error: ' + err.message); }
}

document.getElementById('formInventario').addEventListener('submit', async (e) => {
  e.preventDefault();
  const producto_id = parseInt(document.getElementById('producto_select').value, 10);
  const cantidad = parseInt(document.getElementById('cantidad_add').value, 10);
  if (!producto_id || !cantidad) { alert('Seleccione producto y cantidad'); return; }
  try {
    const res = await fetch(API_INVENTARIO, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ producto_id, cantidad }) });
    if (!res.ok) throw new Error('Error al agregar');
    await loadInventario();
    e.target.reset();
  } catch (err) { alert(err.message); }
});

loadInventario();
