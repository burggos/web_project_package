CREATE DATABASE IF NOT EXISTS sistemaventas;
USE sistemaventas;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  descripcion TEXT,
  precio DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(150),
  apellidos VARCHAR(150),
  cedula VARCHAR(50),
  telefono VARCHAR(50),
  correo VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  cantidad INT DEFAULT 0,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  total DECIMAL(12,2),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP;
);

CREATE TABLE IF NOT EXISTS venta_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT,
  producto_id INT,
  cantidad INT,
  precio DECIMAL(10,2)
);

/* Insert demo data */
INSERT INTO productos (nombre, descripcion, precio) VALUES ('Producto A','Descripcion A',100.00);
INSERT INTO productos (nombre, descripcion, precio) VALUES ('Producto B','Descripcion B',50.50);
INSERT INTO clientes (nombres, apellidos, cedula, telefono, correo) VALUES ('Juan','Perez','12345678','3001112222','juan@example.com');
INSERT INTO inventario (producto_id, cantidad) VALUES (1, 10), (2, 5);
