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

  // Crear nuevo producto
  router.post('/', async (req, res) => {
    try {
      const { nombre, descripcion, precio } = req.body;
      if (!nombre || precio === undefined) return res.status(400).json({ error: 'nombre y precio son obligatorios' });
      const precioNum = parseFloat(precio) || 0;
      const [id] = await db('productos').insert({ nombre, descripcion, precio: precioNum });
      res.status(201).json({ id });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Error al crear producto' });
    }
  });

  return router;
};
