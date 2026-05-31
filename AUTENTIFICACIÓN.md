# PROYECTO-DE-DESARROLLO-DE-APLICACIONES-CON-MACHINE-LEARNING
🚀 Siguiente Paso: Sistema de Autenticación, Roles y Auditoría
[ Registro/Login ] ──> [ Asignación de JWT ] ──> [ Middleware de Roles ] ──> [ Registro en Bitácora de Auditoría ]

Encriptación de contraseñas: Usaremos bcryptjs para que las claves de los usuarios no se guarden en texto plano en MongoDB.

Tokens de Seguridad: Usaremos jsonwebtoken (JWT) para que cuando alguien inicie sesión, el servidor le dé un pase de acceso que React o la app de Android puedan almacenar.

Colección de Auditoría: Crearemos un modelo Auditoria en Mongoose que registre automáticamente: "La secretaria X aprobó la cita Y en la fecha Z".

Para empezar, necesitamos instalar dos dependencias clave en tu backend para manejar la seguridad de las contraseñas y la generación de tokens:

bcryptjs: Para encriptar las contraseñas en MongoDB (nunca se deben guardar en texto plano).

jsonwebtoken (JWT): Para crear los tokens firmados que mantendrán la sesión iniciada en React y Android.

Bash
npm install bcryptjs jsonwebtoken