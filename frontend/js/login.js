document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!usuario || !password) {
      msg.innerHTML = '<span style="color:red;">Usuario y contraseña requeridos.</span>';
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ usuario, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        let msgText = data && data.error ? data.error : 'Credenciales incorrectas';
        throw new Error(msgText);
      }
      // Guardar sesión (simple: localStorage)
      localStorage.setItem('usuario', usuario);
      // Redirigir a clientes.html (o dashboard)
      window.location.href = 'clientes.html';
    } catch (err) {
      msg.innerHTML = `<span style="color:red;">${err.message}</span>`;
    }
  });
});
