# Sistema de Ventas (demo)

Este repositorio contiene un backend en Node/Express con Knex/MySQL y un frontend estático servido por Nginx.

Requisitos
- Docker & Docker Compose
- (Opcional) Node.js y npm si quieres ejecutar el backend localmente sin Docker

Instrucciones rápidas (PowerShell en Windows)
1. Copia el archivo de ejemplo de variables de entorno:

```powershell
cp .env.example .env
# Edita .env y ajusta contraseñas/valores según tu entorno
```

2. Levanta el stack con Docker Compose:

```powershell
docker-compose up --build -d
```

3. Accede al frontend en http://localhost/ y al backend en http://localhost:8080

Comandos útiles
- Ver logs del backend:

```powershell
docker-compose logs --follow backend
```

- Parar y eliminar contenedores:

```powershell
docker-compose down
```

Probar endpoints (script quick-test)

```powershell
.\scripts\test_endpoints.ps1
```

Notas de seguridad
- No guardes contraseñas reales en el repositorio. Usa el archivo `.env` local (no commiteado) o secretos de Docker en producción.

Próximos pasos recomendados
- Añadir autenticación (JWT) para proteger endpoints de escritura.
- Añadir tests de integración (supertest + jest).
- Añadir logger estructurado (pino) y configurar niveles por entorno.
