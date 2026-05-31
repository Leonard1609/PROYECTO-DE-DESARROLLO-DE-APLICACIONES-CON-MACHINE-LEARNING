# PROYECTO-DE-DESARROLLO-DE-APLICACIONES-CON-MACHINE-LEARNING

DISEÑO DE BACKEND:
backend-citas/
├── src/
│   ├── config/
│   │   ├── db.js          (Conexión a MongoDB)
│   │   └── mailer.js      (Configuración de Nodemailer)
│   ├── models/
│   │   └── Cita.js        (Modelo Mongoose)
│   ├── controllers/
│   │   └── citaController.js (Lógica de negocio)
│   ├── routes/
│   │   └── citaRoutes.js  (Rutas de la API)
│   └── app.js             (Configuración de Express)
├── .env                   (Variables de entorno/credenciales)
├── server.js              (Punto de entrada del servidor)
└── package.json