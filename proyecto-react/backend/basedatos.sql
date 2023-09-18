DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;
USE ecommerce;

DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS productos;

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

-- Crear la tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    imagen_url VARCHAR(255),
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO usuarios (nombre, apellido, correo_electronico, contrasena)
VALUES ('Juan', 'Perez', 'juan@example.com', 'contraseña123');

INSERT INTO productos (nombre, marca, descripcion, precio, stock, tipo, imagen_url, usuario_id)
VALUES ('Camiseta de algodón', 'Adidas', 'Camiseta de manga corta en color negro', 19.99, 50, 'indumentaria', 'https://www.mprosports.com/large/ERIMA-ESSENTIAL-5-C-CAMISETA-MANGA-CORTA%2C-NEGRA-BLANCA-HOMBRE.-i88554.jpg', 1);