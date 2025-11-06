const express = require('express');
const logger = require('../lib/logger');
const router = express.Router();

module.exports = (db) => {
  const { check, validationResult } = require('express-validator');

  router.post('/',
    [
      check('cliente_id').isInt().withMessage('cliente_id debe ser un entero'),
      check('items').isArray({ min: 1 }).withMessage('items debe ser un arreglo no vacío'),
      check('items.*.producto_id').isInt().withMessage('producto_id debe ser entero'),
      check('items.*.cantidad').isInt({ gt: 0 }).withMessage('cantidad debe ser entero mayor a 0')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { cliente_id, items } = req.body;

      // Usar transacción para asegurar consistencia
      try {
        const result = await db.transaction(async (trx) => {
          // 1. Calcular total
          let total = 0;
          for (const item of items) {
            const product = await trx('productos').where({ id: item.producto_id }).first();
            if (!product) throw new Error(`Producto ${item.producto_id} no encontrado`);
            total += parseFloat(product.precio) * item.cantidad;
            // comprobar stock suficiente
            const inv = await trx('inventario').where({ producto_id: item.producto_id }).first();
            const stock = inv ? inv.cantidad : 0;
            if (stock < item.cantidad) throw new Error(`Stock insuficiente para producto ${item.producto_id}`);
          }

          // 2. Insertar venta
          const [ventaId] = await trx('ventas').insert({ cliente_id, total, fecha: new Date() });

          // 3. Insertar items y actualizar inventario
          for (const item of items) {
            const product = await trx('productos').where({ id: item.producto_id }).first();

            await trx('venta_items').insert({
              venta_id: ventaId,
              producto_id: item.producto_id,
              cantidad: item.cantidad,
              precio: product.precio
            });

            await trx('inventario').where({ producto_id: item.producto_id }).decrement('cantidad', item.cantidad);
          }

          return { ventaId, total };
        });

        res.json({ message: '✅ Venta realizada con éxito', venta_id: result.ventaId, total: result.total });
      } catch (error) {
  logger.error({ err: error }, 'Error en POST /api/ventas');
        // Si el error es por validación/negocio, devolver 400
        if (error.message && (error.message.includes('Stock insuficiente') || error.message.includes('no encontrado'))) {
          return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al registrar la venta' });
      }
    }
  );

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
