const express = require('express');
const cors = require('cors');

// Rutas (funciones que reciben `db` y devuelven un router)
const clientesRoutes = require('./routes/clientes');
const facturacionRoutes = require('./routes/facturacion');
const inventarioRoutes = require('./routes/inventario');
const ventasRoutes = require('./routes/ventas');
const reportesRoutes = require('./routes/reportes');
const productosRoutes = require('./routes/productos');
const loginRoute = require('./routes/login');

module.exports = function createApp(db, logger) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Registrar rutas
  app.use('/api/clientes', clientesRoutes(db));
  app.use('/api/productos', productosRoutes(db));
  app.use('/api/facturacion', facturacionRoutes(db));
  app.use('/api/inventario', inventarioRoutes(db));
  app.use('/api/ventas', ventasRoutes(db));
  app.use('/api/reportes', reportesRoutes(db));
  app.use('/api/login', loginRoute);

  // health
  app.get('/health', (req, res) => res.json({ ok: true }));

  return app;
};
