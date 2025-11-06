const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Listar productos con stock (0 si no existe inventario)
  router.get('/', async (req, res) => {
    try {
      const rows = await db('productos')
        .leftJoin('inventario', 'productos.id', 'inventario.producto_id')
        .select(
          'productos.id',
          'productos.nombre',
          'productos.descripcion',
          'productos.precio',
          db.raw('COALESCE(inventario.cantidad, 0) as stock')
        );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  // Obtener producto por id con stock
  router.get('/:id', async (req, res) => {
    try {
      const row = await db('productos')
        .leftJoin('inventario', 'productos.id', 'inventario.producto_id')
        .select(
          'productos.id',
          'productos.nombre',
          'productos.descripcion',
          'productos.precio',
          db.raw('COALESCE(inventario.cantidad, 0) as stock')
        )
        .where('productos.id', req.params.id)
        .first();

      if (!row) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  return router;
};
