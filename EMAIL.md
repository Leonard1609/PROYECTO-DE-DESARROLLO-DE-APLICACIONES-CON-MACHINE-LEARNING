# PROYECTO-DE-DESARROLLO-DE-APLICACIONES-CON-MACHINE-LEARNING
📑 Documentación Técnica: Módulo de Notificaciones por Correo (Nodemailer)
Esta sección documenta la implementación, los errores críticos encontrados durante la etapa de desarrollo y las soluciones aplicadas para estabilizar el sistema de alertas del proyecto Backend Citas.

🛠️ 1. Descripción del Módulo
El sistema utiliza Nodemailer en conjunto con el servidor SMTP de Gmail para automatizar el envío de correos electrónicos a los pacientes cuando el personal administrativo gestiona o cambia el estado de una cita médica (Aceptada, Rechazada o Reprogramada) desde el panel web.

❌ 2. Bitácora de Errores y Soluciones
Error Crítico 1: Autenticación Fallida (Error: Invalid login: 535-5.7.8 Username and Password not accepted)
Síntoma: Al intentar actualizar una cita, la consola del backend arrojaba un error de tipo EAUTH con el código de respuesta 535 proveniente de los servidores de Google (gsmtp), bloqueando el flujo.

Causa Raíz: 1. Las políticas modernas de seguridad de Google impiden el inicio de sesión directo con la contraseña clásica de la cuenta a través de scripts externos (servicios menos seguros).
2. Inicialmente se intentó utilizar un string estático o credenciales sin los permisos adecuados dentro del entorno local.

Solución Aplicada:

Se activó de manera mandatoria la Verificación en 2 pasos en la cuenta de Google vinculada (darkkrisalix616@gmail.com).

Se generó una Contraseña de Aplicación exclusiva de 16 caracteres desde el panel de seguridad de Google.

Se removieron los espacios en blanco del token y se mapeó de manera segura dentro del entorno de configuración.

Error 2: Desincronización de Variables de Entorno (Cache de Consola / Extensión)
Síntoma: A pesar de tener el token correcto de 16 dígitos en el archivo .env, el servidor seguía arrojando BadCredentials.

Causa Raíz: El entorno de ejecución de Node.js mantenía en caché las variables de entorno antiguas (o el string de marcador de posición) debido a procesos residentes en segundo plano o inyecciones automáticas de herramientas Git.

Solución Aplicada: Se instaló explícitamente el paquete dotenv (npm install dotenv), se forzó su carga en la primera línea del archivo ejecutable principal (server.js) con require('dotenv').config(); y se realizó un reinicio limpio del proceso limpiando el puerto de red.

📝 3. Formato Final de Configuración Segura
Para asegurar el correcto despliegue del servicio, las credenciales se segmentaron estrictamente dentro del archivo .env en la raíz del backend:

Fragmento de código
PORT=5000
MONGO_URI=mongodb://localhost:27017/sistema_citas
EMAIL_USER=darkkrisalix616@gmail.com
EMAIL_PASS=bzwxzvccejmcowxd
(Nota: El token EMAIL_PASS equivale a la firma criptográfica autorizada por Google eliminando los espacios estructurales).