document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clienteForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener datos del formulario
    const body = {
      nombres: document.getElementById('nombres').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      cedula: document.getElementById('cedula').value.trim()
    };

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error(`Error ${res.status}: No se pudo guardar`);

      const data = await res.json();
      msg.innerHTML = `<span style="color:green;">✅ Cliente creado correctamente</span>`;
      form.reset(); // Limpiar formulario

    } catch (error) {
      msg.innerHTML = `<span style="color:red;">❌ Error: ${error.message}</span>`;
    }
  });
});
