document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clienteForm');
  const msg = document.getElementById('msg');
  const tbody = document.getElementById('clientes-tbody');

  // Cargar listado de clientes
  async function loadClientes() {
    try {
      const res = await fetch('/api/clientes');
      const payload = await res.json();
      const clientes = payload && payload.data ? payload.data : payload;
      tbody.innerHTML = clientes.map(c => `
        <tr class="bg-gray-50 hover:bg-gray-100">
          <td class="p-2 border">${(c.nombres||'') + ' ' + (c.apellidos||'')}</td>
          <td class="p-2 border">${c.cedula||''}</td>
          <td class="p-2 border">${c.correo||''}</td>
          <td class="p-2 border">${c.telefono||''}</td>
          <td class="p-2 border">
            <button data-id="${c.id}" class="editar bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">Editar</button>
            <button data-id="${c.id}" class="eliminar bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700">Eliminar</button>
          </td>
        </tr>
      `).join('');

      // asignar handlers de eliminar
      document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          if (!confirm('¿Eliminar cliente ' + id + '?')) return;
          try {
            const r = await fetch('/api/clientes/' + id, { method: 'DELETE' });
            if (!r.ok) throw new Error('Error al eliminar');
            loadClientes();
          } catch (err) {
            alert('No se pudo eliminar: ' + err.message);
          }
        });
      });
    } catch (err) {
      console.error('Error cargando clientes', err);
    }
  }

  loadClientes();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Validación visual
    if (!form.checkValidity()) {
      msg.innerHTML = '<span style="color:red;">Por favor completa los campos obligatorios correctamente.</span>';
      return;
    }
    // Obtener datos del formulario
    const body = {
      nombres: document.getElementById('nombres').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      cedula: document.getElementById('cedula').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      correo: document.getElementById('correo').value.trim()
    };

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        let msgText = data && data.errors ? data.errors.map(e=>e.msg).join('<br>') : `Error ${res.status}: No se pudo guardar`;
        throw new Error(msgText);
      }

      msg.innerHTML = `<span style="color:green;">✅ Cliente creado correctamente</span>`;
      form.reset(); // Limpiar formulario
      // recargar listado
      loadClientes();

    } catch (error) {
      msg.innerHTML = `<span style="color:red;">❌ Error: ${error.message}</span>`;
    }
  });
});
