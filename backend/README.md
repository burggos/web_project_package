API Backend - Sistema de Ventas (demo)

Endpoints:
 /api/health
 /api/productos [GET, POST]
 /api/productos/:id [PUT, DELETE]
 /api/clientes [GET, POST]
 /api/ventas [POST]

Environment variables (docker compose sets these):
 DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

To run locally:
 1. npm install
 2. Set env vars or use defaults
 3. node index.js
