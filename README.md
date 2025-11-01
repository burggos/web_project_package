Proyecto demo: Sistema de Ventas (Frontend + Backend + MySQL) dockerizado

Estructura:
- backend: Node.js Express API
- frontend: static HTML served by nginx
- db: MySQL with init SQL

Requisitos:
- Docker y Docker Compose instalados
- VS Code para editar el proyecto

Pasos para ejecutar:
1. Descomprimir el ZIP y abrir la carpeta en VS Code.
2. En la terminal (en la carpeta raíz del proyecto) ejecutar: docker compose up --build
3. Esperar a que los servicios inicien:
   - MySQL en el puerto 3306
   - Backend en el puerto 8080
   - Frontend en el puerto 80
4. Acceder a: http://localhost  (panel frontend)
5. APIs disponibles:
   - http://localhost/api/health
   - http://localhost/api/productos
   - http://localhost/api/clientes
   - http://localhost/api/ventas

Notas:
- El archivo db/init.sql crea la base de datos y tablas iniciales con datos demo.
- Si el contenedor de backend falla al iniciarse, revisar los logs con: docker compose logs backend
