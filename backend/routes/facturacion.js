const express = require('express');
const logger = require('../lib/logger');
const router = express.Router();

module.exports = (db) => {
  // Obtener todas las facturas
  router.get('/', async (req, res) => {
    try {
      const ventas = await db('ventas')
        .select('ventas.id', 'ventas.fecha', 'ventas.total', 'clientes.nombres', 'clientes.apellidos')
        .leftJoin('clientes', 'ventas.cliente_id', 'clientes.id');
      res.json(ventas);
    } catch (err) {
      try { logger.error({ err }, 'Error GET /api/facturacion'); } catch(e){}
      res.status(500).json({ error: 'db error' });
    }
  });

  // Obtener una factura detallada
  router.get('/:id', async (req, res) => {
    try {
      const venta = await db('ventas').where({ id: req.params.id }).first();
      const items = await db('venta_items')
        .join('productos', 'venta_items.producto_id', 'productos.id')
        .select('productos.nombre', 'venta_items.cantidad', 'venta_items.precio')
        .where({ venta_id: req.params.id });

      res.json({ venta, items });
    } catch (err) {
      res.status(500).json({ error: 'db error' });
    }
  });

  return router;
};
