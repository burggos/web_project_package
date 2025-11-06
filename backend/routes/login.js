const express = require('express');
const router = express.Router();
const knex = require('../lib/knex');

// POST /api/login
router.post('/', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }
  try {
    const user = await knex('usuarios').where({ usuario }).first();
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    // No se envía el password al frontend
    res.json({ usuario: user.usuario, rol: user.rol });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
