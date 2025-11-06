const knex = require('knex');
const createApp = require('./app');
const logger = require('./lib/logger');

// 1) Crear instancia de knex (usa mysql2 como client)
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'tienda_db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  },
  pool: { min: 0, max: 7 },
  debug: false
});

const PORT = process.env.PORT || 8080;

// Crear app y montar rutas (app.js exporta una función que espera `db`)
const app = createApp(db, logger);

// Probar conexión y arrancar servidor
db.raw('select 1+1 as result')
  .then(() => {
    logger.info('✅ Conexión exitosa a la base de datos (knex)');
    app.listen(PORT, () => {
      logger.info(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error({ err }, '❌ Error al conectar a la base de datos (knex)');
    process.exit(1);
  });

module.exports = { db, createApp };
