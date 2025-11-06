const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Total de ventas (conteo + suma de ingresos)
  router.get('/ventas', async (req, res) => {
    try {
      const result = await db('ventas').count('* as total_ventas').sum('total as ingresos').first();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  // Productos con poco stock (< 5) — usa tabla inventario
  router.get('/stock-bajo', async (req, res) => {
    try {
      const rows = await db('inventario')
        .join('productos', 'inventario.producto_id', 'productos.id')
        .select('productos.id', 'productos.nombre', 'productos.precio', 'inventario.cantidad')
        .where('inventario.cantidad', '<', 5);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  return router;
};
