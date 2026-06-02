# PROYECTO-DE-DESARROLLO-DE-APLICACIONES-CON-MACHINE-LEARNING

💻 Configuración del Proyecto Web (React)
Para mantener la independencia de tus componentes, crearemos una carpeta separada para la web al mismo nivel que tu backend.

Abre una nueva terminal en tu computadora (fuera de la carpeta del backend).

Crea el proyecto de React usando Vite (que es mucho más rápido y moderno):

Bash
npm create vite@latest frontend-citas -- --template react
Entra a la carpeta que se creó:

Bash
cd frontend-citas
Instala las dependencias necesarias (Axios para conectar con el backend y Tailwind CSS si deseas estilos rápidos, aunque usaremos CSS básico/módulos para ir directo a la lógica):

Bash
npm install axios
Enciende el servidor de desarrollo de React:

Bash
npm run dev

🛠️ Creación del Panel de la Secretaria
Reemplazaremos el código del archivo principal de React para renderizar una tabla de control. En ella se listarán las citas en tiempo real y habrá botones dinámicos para cambiar el estado de cada solicitud.

!---------¡
🏁 Prueba del Circuito Completo (Móvil ➡️ Web ➡️ Email)
Asegúrate de que tu backend esté corriendo (server.js) con MongoDB activo.
Abre tu panel en React desde el navegador (http://localhost:5173 o el puerto que te asigne Vite).
Entra a la aplicación móvil en tu emulador, rellena los datos introduciendo un correo real tuyo en el campo del Gmail, y envíala.

Actualiza la página web de React. Verás aparecer inmediatamente la cita del paciente en la tabla con fondo amarillo y el estado Pendiente.
En la Web, haz clic en Aceptar (o reprogramar).
Al hacer clic, la web llamará a tu controlador MVC, este guardará los cambios en la base de datos y Nodemailer despachará el correo electrónico directo a la bandeja del correo que pusiste en el formulario móvil. ¡Revisa tu buzón de entrada o la carpeta de Spam!

 !---------¡
📂 Arquitectura MVC en el Frontend (React)
Para implementar el patrón Modelo-Vista-Controlador en un cliente SPA como React, adaptamos los conceptos así:

Modelo (Services / API): Clases o funciones encargadas de interactuar con el backend (Axios).

Controlador (Hooks personalizados / Lógica): Manejo del estado, lógica de filtros y las funciones de eventos.

Vista (Components): Componentes visuales puros que solo pintan la interfaz (Tablas, botones, formularios).