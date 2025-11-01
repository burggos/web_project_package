const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post('/', async (req, res) => {
    const { cliente_id, items } = req.body;
    let total = 0;

    try {
      // 1. Calcular total de la venta
      for (const item of items) {
        const product = await db('productos').where({ id: item.producto_id }).first();
        total += product.precio * item.cantidad;
      }

      // 2. Insertar la venta
      const [ventaId] = await db('ventas').insert({
        cliente_id,
        total,
        fecha: new Date()
      });

      // 3. Insertar los productos vendidos y actualizar inventario
      for (const item of items) {
        const product = await db('productos').where({ id: item.producto_id }).first();

        await db('venta_items').insert({
          venta_id: ventaId,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio: product.precio
        });

        await db('inventario')
          .where({ producto_id: item.producto_id })
          .decrement('cantidad', item.cantidad);
      }

      res.json({ message: '✅ Venta realizada con éxito', venta_id: ventaId, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar la venta' });
    }
  });

  // Ver todas las ventas
  router.get('/', async (req, res) => {
    try {
      const data = await db('ventas').select('*');
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ventas' });
    }
  });

  return router;
};
