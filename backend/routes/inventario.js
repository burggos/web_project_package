const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Obtener inventario con nombre y precio del producto
  router.get('/', async (req, res) => {
    try {
      const data = await db('inventario')
        .join('productos', 'inventario.producto_id', '=', 'productos.id')
        .select('inventario.id', 'productos.nombre', 'productos.precio', 'inventario.cantidad');
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener inventario' });
    }
  });

  // Añadir producto al inventario
  router.post('/', async (req, res) => {
    const { producto_id, cantidad } = req.body;
    try {
      await db('inventario').insert({ producto_id, cantidad });
      res.json({ message: '✅ Producto agregado al inventario' });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar producto al inventario' });
    }
  });

  // Actualizar cantidad
  router.put('/:id', async (req, res) => {
    const { cantidad } = req.body;
    try {
      await db('inventario').where({ id: req.params.id }).update({ cantidad });
      res.json({ message: '✅ Inventario actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar inventario' });
    }
  });

  return router;
};
