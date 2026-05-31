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

🗃️ Paso 1: Crear el Modelo de Usuario (src/models/Usuario.js)
Crea un nuevo archivo llamado Usuario.js dentro de tu carpeta src/models/ para definir la estructura de las credenciales y los roles.

🎮 Paso 2: Crear el Controlador de Autenticación (src/controllers/authController.js)
Crea el archivo authController.js en src/controllers/. Aquí manejaremos la lógica matemática y de negocio para registrar usuarios, verificar contraseñas y firmar los tokens JWT.

🛣️ Paso 3: Definir las Rutas (src/routes/authRoutes.js)
Crea el archivo authRoutes.js en la carpeta src/routes/ para exponer los endpoints hacia el exterior:

Ahora, para activar estas rutas globales dentro de tu aplicación, abre tu archivo server.js y agrégalas junto a tus rutas de citas existentes:

JavaScript
// En tu server.js añade la importación y el uso de las rutas:
const authRoutes = require('./src/routes/authRoutes');
// ... debajo de app.use('/api/citas', citaRoutes);
app.use('/api/auth', authRoutes);


🛡️ ¿Cómo funcionará el Panel de Auditoría?
Cada vez que una secretaria apruebe, rechace o reprograme una cita, o cuando un usuario realice un cambio importante, capturaremos:

Quién lo hizo (ID y Rol del usuario autenticado).

Qué acción realizó (ej: "APROBAR_CITA", "REPROGRAMAR_CITA").

Detalles extras (ej: "Se aprobó la cita del paciente Diego").

Fecha y hora exacta.

Para lograr esto sin duplicar código en todos los controladores, crearemos un esquema de base de datos para las bitácoras y un Middleware de verificación JWT para identificar al usuario en cada petición.

🗃️ Paso 1: Crear el Modelo de Auditoría (src/models/Auditoria.js)
Crea este archivo para definir la estructura de la colección que albergará el historial clínico de acciones:

🎛️ Paso 2: Crear el Middleware de Autenticación y Auditoría (src/middlewares/authMiddleware.js)
Este intermediario se encargará de interceptar las rutas protegidas, leer el token JWT que viene del frontend, verificar que sea válido e inyectar el objeto req.usuario para que sepamos exactamente quién está operando.

Crea el archivo authMiddleware.js dentro de una nueva carpeta llamada src/middlewares/:

🔨 Paso 3: Registrar eventos en el Controlador (src/controllers/citaController.js)
Vamos a hacer que cuando la secretaria use el método actualizarCita para cambiar el estado (Aceptada, Rechazada, Reprogramada), se guarde automáticamente una fila de auditoría.

Abre src/controllers/citaController.js, importa el modelo de auditoría arriba

🛡️ Paso 4: Proteger las Rutas en src/routes/citaRoutes.js
Para que el controlador pueda saber qué usuario está logueado (req.usuario), debemos poner el middleware protector antes de la ruta de actualización de citas.

Abre tu archivo src/routes/citaRoutes.js y adáptalo


Casi Completa:
Ahora que la infraestructura de datos y la interceptación de seguridad con JWT están completamente operativas, el paso final para concluir este bloque es exponer el endpoint del Panel de Auditoría mediante una API. De esta manera, el frontend de React podrá consumir los registros e imprimirlos en una tabla exclusiva para la administración de la clínica.

🛠️ Paso 1: Crear las Rutas de Auditoría (src/routes/auditoriaRoutes.js)
Vamos a crear un archivo dedicado a manejar las consultas del panel de auditoría. Esta ruta debe estar fuertemente protegida: solo los usuarios autenticados con un token válido y que además posean el rol de secretaria o administrador deberían poder leer estas bitácoras.

Crea el archivo auditoriaRoutes.js dentro de tu carpeta src/routes/:

🔌 Paso 2: Vincular las nuevas rutas en el Servidor Principal (server.js)
Para que Express reconozca y exponga este nuevo segmento de tu API global, abre tu archivo server.js y monta el enrutador de auditorías junto a los que ya tienes listos.

Modifica tu server.js agregando las siguientes líneas:

JavaScript
// ... Tus otras importaciones existentes
const authRoutes = require('./src/routes/authRoutes');
const citaRoutes = require('./src/routes/citaRoutes');
const auditoriaRoutes = require('./src/routes/auditoriaRoutes'); // ✨ Nueva Importación

// ... Tus middlewares globales (express.json, cors, etc.)

// --- Rutas de la Aplicación ---
app.use('/api/auth', authRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/auditorias', auditoriaRoutes); // ✨ Activación del Endpoint de Auditoría

📊 Estructura de visualización recomendada para el Frontend en ReactCuando decidas construir la interfaz gráfica del Panel de Auditoría en tu aplicación web de administración, el JSON devuelto por esta API estará listo para ser mapeado de forma muy clara. Una estructura de diseño ideal para renderizar estos datos confidenciales sería la siguiente:Componente de Tabla Administrativa (AuditoriaTable.jsx)Operario / UsuarioRolAcción EjecutadaDescripción del MovimientoDirección IPFecha y HoraMaría LópezsecretariaMODIFICAR_ESTADO_ACEPTADASe aceptó la cita médica de Sam192.168.1.4531/05/2026 - 15:22Carlos GómezsecretariaMODIFICAR_ESTADO_REPROGRAMADAEl usuario modificó la cita del paciente Diego al estado: Reprogramada1

✅ Verificación Final del Circuito:
Guarda todos los archivos en tu editor.

Si el proceso en tu terminal sigue activo, puedes reiniciarlo de forma segura con node server.js para asegurar que las nuevas rutas se carguen en memoria.

El backend quedará completamente blindado, listo para registrar de manera transparente cualquier alteración en el estado de las citas en MongoDB.