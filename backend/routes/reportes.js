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

  // Detalle de todas las ventas: ventas con cliente e items
  router.get('/ventas/detalle', async (req, res) => {
    try {
      // obtener ventas con información del cliente
      const ventas = await db('ventas')
        .leftJoin('clientes', 'ventas.cliente_id', 'clientes.id')
        .select(
          'ventas.id',
          'ventas.total',
          'ventas.fecha',
          'clientes.id as cliente_id',
          'clientes.nombres',
          'clientes.apellidos',
          'clientes.cedula',
          'clientes.telefono',
          'clientes.correo'
        )
        .orderBy('ventas.fecha', 'desc');

      // obtener items de ventas con nombre de producto
      const items = await db('venta_items')
        .leftJoin('productos', 'venta_items.producto_id', 'productos.id')
        .select(
          'venta_items.venta_id',
          'venta_items.producto_id',
          'productos.nombre as producto_nombre',
          'venta_items.cantidad',
          'venta_items.precio'
        );

      // agrupar items por venta
      const mapa = {};
      ventas.forEach(v => { mapa[v.id] = { id: v.id, total: v.total, fecha: v.fecha, cliente: { id: v.cliente_id, nombres: v.nombres, apellidos: v.apellidos, cedula: v.cedula, telefono: v.telefono, correo: v.correo }, items: [] } });
      items.forEach(it => { if (mapa[it.venta_id]) mapa[it.venta_id].items.push({ producto_id: it.producto_id, producto_nombre: it.producto_nombre, cantidad: it.cantidad, precio: it.precio }); });

      res.json(Object.values(mapa));
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  return router;
};
