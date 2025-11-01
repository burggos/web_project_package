const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const facturacionRoutes = require('./routes/facturacion');
const inventarioRoutes = require('./routes/inventario');
const ventasRoutes = require('./routes/ventas');
const reportesRoutes = require('./routes/reportes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ 1. Crear conexión a MySQL ANTES de usar las rutas
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'tienda_db'
});

// ✅ 2. Conectar base de datos y luego montar rutas + levantar servidor
db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    process.exit(1); // Salir si falla la base de datos
  }
  console.log('✅ Conexión exitosa a MySQL');

  // ✅ 3. Registrar las rutas una vez la base está disponible
  app.use('/api/clientes', clientesRoutes(db));
  app.use('/api/facturacion', facturacionRoutes(db));
  app.use('/api/inventario', inventarioRoutes(db));
  app.use('/api/ventas', ventasRoutes(db));
  app.use('/api/reportes', reportesRoutes(db));

  // ✅ 4. Iniciar backend
  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  });
});
