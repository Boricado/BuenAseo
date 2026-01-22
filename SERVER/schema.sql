-- 1. TABLA USUARIOS
-- Coincide con 
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre CHARACTER VARYING(100) NOT NULL,
    direccion TEXT,
    telefono CHARACTER VARYING(20),
    email CHARACTER VARYING(100) UNIQUE NOT NULL,
    password_hash CHARACTER VARYING(255) NOT NULL,
    rol CHARACTER VARYING(20) DEFAULT 'Cliente' -- 'Cliente' o 'Super' según la imagen 
);

-- 2. TABLA PRODUCTOS
-- Coincide con [cite: 4]
CREATE TABLE productos (
    id CHARACTER VARYING(50) PRIMARY KEY, -- Ej: 'PRD-ALMOHADA'
    nombre CHARACTER VARYING(255) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    descripcion TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT
);

-- 3. TABLA SERVICIOS
-- Coincide con [cite: 5]
CREATE TABLE servicios (
    id CHARACTER VARYING(50) PRIMARY KEY, -- Ej: 'SVC-1D1B'
    nombre CHARACTER VARYING(255) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    descripcion TEXT,
    imagen_url TEXT
);

-- 4. TABLA FAVORITOS
-- Coincide con [cite: 3]
CREATE TABLE favoritos (
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    item_id CHARACTER VARYING(50) NOT NULL,
    PRIMARY KEY (usuario_id, item_id)
);

-- 5. TABLA CARRITO
-- Coincide con 
CREATE TABLE carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    item_id CHARACTER VARYING(50) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    tipo CHARACTER VARYING(20), -- 'producto' o 'servicio'
    agregado_en TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA COMPRAS (Historial de ventas)
-- Coincide con [cite: 2]
CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    producto CHARACTER VARYING(255) NOT NULL, -- Nombre o ID del producto comprado
    cantidad INTEGER NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ventas
ADD COLUMN estado VARCHAR

