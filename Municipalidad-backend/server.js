// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Configurar Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔌 Conexión a la Base de Datos MySQL (phpMyAdmin)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Tu usuario por defecto de XAMPP / WampServer
    password: '',       // Tu contraseña (vacía por defecto en XAMPP)
    database: 'municipalidad_yau'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('🚀 Conectado con éxito a la base de datos MySQL (municipalidad_yau)');
});

// ==========================================
// 🛣️ ENDPOINTS / RUTAS DE LA API
// ==========================================

/**
 * 1. OBTENER TRÁMITES (Para el Dashboard Web en React)
 * Devuelve todos los trámites registrados para que el personal municipal los gestione.
 */
app.get('/api/tramites', (query, res) => {
    const sql = 'SELECT * FROM tramites ORDER BY id_tramite DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los trámites' });
        }
        res.json(results);
    });
});

/**
 * 2. CREAR TRÁMITE (Para la App Móvil en Android Java)
 * Inserta de forma permanente en la tabla 'tramites' la solicitud del ciudadano.
 * Inicialmente se asigna una prioridad fija o "Por Evaluar" antes de integrar el ML.
 */
app.post('/api/tramites', (req, res) => {
    const { tipo_tramite, descripcion } = req.body;

    if (!tipo_tramite || !descripcion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Insertamos dejando id_ciudadano como NULL temporalmente y prioridad por evaluar
    const sql = 'INSERT INTO tramites (tipo_tramite, descripcion, estado, prioridad_ml) VALUES (?, ?, ?, ?)';
    const valores = [tipo_tramite, descripcion, 'Pendiente', 'Por Evaluar'];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al registrar el trámite en MySQL' });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Trámite guardado permanentemente', 
            id_tramite: result.insertId 
        });
    });
});

/**
 * 3. ACTUALIZAR ESTADO Y CREAR ALERTA (Para la Web en React)
 * Cambia el estado del trámite y registra de forma permanente la notificación en la base de datos.
 */
app.put('/api/tramites/:id', (req, res) => {
    const idTramite = req.params.id;
    const { estado } = req.body;

    // Actualizar el estado del trámite
    const sqlUpdateTramite = 'UPDATE tramites SET estado = ? WHERE id_tramite = ?';
    
    db.query(sqlUpdateTramite, [estado, idTramite], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el trámite' });
        }

        // Crear una alerta en la tabla de notificaciones para que quede constancia en phpMyAdmin
        const mensajeAlerta = `Tu trámite número ${idTramite} ha cambiado a: ${estado}.`;
        const sqlInsertNotificacion = 'INSERT INTO notificaciones (id_tramite, mensaje) VALUES (?, ?)';

        db.query(sqlInsertNotificacion, [idTramite, mensajeAlerta], (errNotif) => {
            if (errNotif) {
                console.error('Error al guardar notificación:', errNotif);
                // No bloqueamos la respuesta principal si solo falló el log de notificación
            }
            
            res.json({ 
                success: true, 
                message: 'Trámite actualizado y notificación registrada en la base de datos.' 
            });
        });
    });
});

// Levantar Servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 Servidor Backend corriendo en http://localhost:${PORT}`);
});