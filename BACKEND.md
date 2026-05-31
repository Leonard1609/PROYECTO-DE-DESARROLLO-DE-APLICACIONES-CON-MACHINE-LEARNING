# PROYECTO-DE-DESARROLLO-DE-APLICACIONES-CON-MACHINE-LEARNING

🚀 Paso 1: Configuración del Proyecto
Crea una carpeta para tu proyecto llamada backend-citas y abre tu terminal dentro de ella.

Inicializa el proyecto de Node.js ejecutando:

Bash
npm init -y
Instala las dependencias necesarias para esta primera fase (Express para el servidor, Mongoose para conectar MongoDB, Cors para permitir conexiones externas y Nodemailer para los correos):

Bash
npm install express mongoose cors nodemailer dotenv

📝 Paso 2: El Código del Servidor (server.js)
Crea un archivo llamado server.js en la raíz de tu carpeta. Este único archivo contendrá la conexión a la base de datos, el modelo de la cita, el configurador de correos y los endpoints (rutas) que usarán tu app móvil y tu web.

🏃‍♂️ ¿Cómo probar que funciona?
En tu terminal ejecuta el servidor con: node server.js (Debería decir Servidor backend corriendo... y Conectado a MongoDB).

Puedes usar herramientas como Postman o Thunder Client (extensión de VS Code) para simular las peticiones del móvil y de la web antes de programarlos.

⚠️ Nota sobre Gmail: Para que Nodemailer pueda enviar correos reales desde tu cuenta de Gmail, necesitas ir a la configuración de seguridad de tu cuenta de Google, activar la "Verificación en dos pasos" y generar una "Contraseña de aplicación". Esa contraseña de 16 letras es la que pondrás en el código en lugar de tu contraseña normal.

