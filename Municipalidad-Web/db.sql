CREATE DATABASE municipalidad_yau;
USE municipalidad_yau;

-- 1. Tabla de Usuarios (Ciudadanos y Personal Municipal)
-- Cumple con la Ley de Protección de Datos encriptando accesos [cite: 8]
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ciudadano', 'empleado', 'administrador') DEFAULT 'ciudadano',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Trámites
-- Almacena los estados y la prioridad calculada por el Machine Learning [cite: 10, 11]
CREATE TABLE tramites (
    id_tramite INT AUTO_INCREMENT PRIMARY KEY,
    id_ciudadano INT,
    tipo_tramite VARCHAR(100) NOT NULL, -- Ej: Licencia de Funcionamiento, Constancia
    descripcion TEXT,
    estado ENUM('Pendiente', 'En Revisión', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
    prioridad_ml ENUM('Baja', 'Media', 'Alta') DEFAULT 'Baja', -- Determinado por el algoritmo
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ciudadano) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 3. Tabla de Notificaciones / Alertas
-- Para el sistema de alertas rápidas al ciudadano 
CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_tramite INT,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE
);

ALTER TABLE `tramites` 
MODIFY COLUMN `prioridad_ml` ENUM('Por Evaluar', 'Baja', 'Media', 'Alta') DEFAULT 'Por Evaluar';

ALTER TABLE `tramites` 
MODIFY COLUMN `id_ciudadano` INT NULL;