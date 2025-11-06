const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sistemaventas',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  },
  pool: { min: 0, max: 7 },
  debug: false
});

module.exports = db;
