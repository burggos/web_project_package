const API_URL = "/api/productos";

async function loadInventario() {
  const res = await fetch(API_URL);
  const productos = await res.json();
  
  const div = document.getElementById("list");
  if (productos.length === 0) {
    div.innerHTML = "<p>No hay productos registrados.</p>";
    return;
  }
  
  div.innerHTML = `
    <table class="tabla">
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th></tr>
      </thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
          </tr>`).join("")}
      </tbody>
    </table>
  `;
}

document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const nuevoProducto = {
    nombre: document.getElementById("nombre").value,
    precio: parseFloat(document.getElementById("precio").value),
    stock: parseInt(document.getElementById("stock").value),
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto),
  });

  if (res.ok) {
    alert("Producto agregado correctamente");
    loadInventario(); // Recarga la tabla
    e.target.reset(); // Limpia el formulario
  } else {
    alert("Error al agregar el producto");
  }
});

loadInventario();
