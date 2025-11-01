const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // Obtener todos los clientes
  router.get('/', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // Agregar cliente
  router.post('/', (req, res) => {
    const { nombre, email, telefono } = req.body;
    db.query(
      'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
      [nombre, email, telefono],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: '✅ Cliente registrado', id: result.insertId });
      }
    );
  });

  // Eliminar cliente por ID
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM clientes WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: '🗑️ Cliente eliminado' });
    });
  });

  return router;
};
