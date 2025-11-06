# Test básico de endpoints (PowerShell)
# Ejecutar desde la raíz del repo con Docker Compose corriendo

$base = 'http://localhost:8080'
Write-Host "GET $base/api/productos"
Invoke-RestMethod -Uri "$base/api/productos" -UseBasicParsing | ConvertTo-Json -Depth 3 | Write-Host

Write-Host "GET $base/api/clientes"
Invoke-RestMethod -Uri "$base/api/clientes" -UseBasicParsing | ConvertTo-Json -Depth 3 | Write-Host

Write-Host "POST $base/api/ventas (prueba)"
$body = @{ cliente_id = 1; items = @(@{ producto_id = 1; cantidad = 1 }) }
Invoke-RestMethod -Method Post -Uri "$base/api/ventas" -Body ($body | ConvertTo-Json -Depth 5) -ContentType 'application/json' -UseBasicParsing | ConvertTo-Json -Depth 3 | Write-Host
