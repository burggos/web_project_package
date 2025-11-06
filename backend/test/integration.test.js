const request = require('supertest');
const knexLib = require('knex');
const createApp = require('../app');

// Crear conexión knex para tests usando variables de entorno (mismos defaults que index.js)
const db = knexLib({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'tienda_db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  },
  pool: { min: 0, max: 7 }
});

const app = createApp(db);

afterAll(async () => {
  await db.destroy();
});

describe('Integración endpoints principales', () => {
  test('GET /api/productos devuelve lista', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  // productos endpoint puede devolver directamente un array o { value: array }
  const arr = Array.isArray(res.body) ? res.body : res.body.value;
  expect(Array.isArray(arr)).toBe(true);
  });

  test('GET /api/clientes devuelve paginado', async () => {
    const res = await request(app).get('/api/clientes?q=&page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/ventas registra venta (si hay stock)', async () => {
    // usar cliente y producto existentes (seed del init.sql)
    const payload = { cliente_id: 1, items: [{ producto_id: 1, cantidad: 1 }] };
    const res = await request(app).post('/api/ventas').send(payload).set('Accept', 'application/json');
    expect([200,201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('venta_id');
  }, 10000);
});
