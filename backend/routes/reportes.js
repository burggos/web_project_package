const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Total de ventas
  router.get('/ventas', (req, res) => {
    db.query('SELECT COUNT(*) AS total_ventas, SUM(total) AS ingresos FROM ventas', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    });
  });

  // Productos con poco stock (< 5)
  router.get('/stock-bajo', (req, res) => {
    db.query('SELECT * FROM productos WHERE stock < 5', (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  return router;
};
