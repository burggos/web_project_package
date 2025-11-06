const express = require('express');
const { check, validationResult } = require('express-validator');
const logger = require('../lib/logger');
const router = express.Router();

module.exports = (db) => {

  // Obtener clientes con búsqueda y paginación
  // Query params: q (texto), page (1-based), limit
  router.get('/', async (req, res) => {
    try {
      const q = req.query.q ? String(req.query.q).trim() : null;
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
      const offset = (page - 1) * limit;

      // Construir query de conteo y de datos aplicando filtros iguales
      const applyFilters = (query) => {
        if (q) {
          return query.where(function() {
            this.where('nombres', 'like', `%${q}%`)
              .orWhere('apellidos', 'like', `%${q}%`)
              .orWhere('cedula', 'like', `%${q}%`);
          });
        }
        return query;
      };

      // Obtener total con raw SQL para evitar problemas con ONLY_FULL_GROUP_BY
      let whereSql = '';
      const bindings = [];
      if (q) {
        whereSql = 'WHERE nombres LIKE ? OR apellidos LIKE ? OR cedula LIKE ?';
        bindings.push(`%${q}%`, `%${q}%`, `%${q}%`);
      }
      const countSql = `SELECT COUNT(*) as total FROM clientes ${whereSql}`;
      const totalResult = await db.raw(countSql, bindings);
      // mysql2 returns [rows, fields] inside knex raw; rows may be in totalResult[0]
      let totalRow = totalResult && totalResult[0] ? totalResult[0][0] || totalResult[0] : totalResult[0];
      const total = totalRow && (totalRow.total !== undefined) ? totalRow.total : (totalRow && totalRow[0] && totalRow[0].total) || 0;

      const dataQuery = applyFilters(db('clientes').select('id','nombres','apellidos','cedula','telefono','correo','created_at'))
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset);
  try { logger.debug({ sql: countSql, bindings }, 'COUNT SQL'); } catch(e){}
  try { logger.debug({ sql: dataQuery.toString() }, 'DATA SQL'); } catch(e){}
      const data = await dataQuery;

      res.json({ data, page, limit, total: parseInt(total, 10) });
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  // Agregar cliente (coincide con columnas en db/init.sql)
  router.post('/',
    [
      check('nombres').isString().isLength({ min: 2 }).withMessage('nombres debe tener al menos 2 caracteres'),
      check('apellidos').optional().isString(),
      check('cedula').optional().isString(),
      check('telefono').optional().isString(),
      check('correo').optional().isEmail().withMessage('correo no es un email válido')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { nombres, apellidos, cedula, telefono, correo } = req.body;

      try {
        const [id] = await db('clientes').insert({ nombres, apellidos, cedula, telefono, correo });
        res.status(201).json({ message: '✅ Cliente registrado', id });
      } catch (err) {
        res.status(500).json({ error: err.message || err });
      }
    }
  );

  // Eliminar cliente por ID
  router.delete('/:id', async (req, res) => {
    try {
      await db('clientes').where({ id: req.params.id }).del();
      res.json({ message: '🗑️ Cliente eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  });

  return router;
};
