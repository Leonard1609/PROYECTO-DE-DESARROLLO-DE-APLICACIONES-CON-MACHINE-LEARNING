💻 1. Módulo Web (React): Arquitectura y Vistas
Para la página web, manejaremos una estructura limpia basada en componentes para que la transición entre el Login y los paneles de control sea fluida.

A. Vistas Públicas (Autenticación)
Login.jsx: Formulario centrado, limpio, con campos de Correo y Contraseña. Incluirá un botón destacado para ingresar y un enlace sutil hacia el registro y la recuperación de credenciales.

Register.jsx: Formulario de creación de cuenta para los nuevos pacientes (por defecto, el backend les asignará el rol paciente).

ForgotPassword.jsx: Pantalla simple donde el usuario ingresará su correo registrado para recibir un enlace o token de restablecimiento de contraseña.

B. Vistas Privadas (Paneles de Control según Rol)
Vista del Paciente:

Una interfaz simplificada donde puede solicitar sus citas médicas.

Importante: En esta vista se ocultan por completo la columna de Inteligencia Artificial (Ausentismo, Reingreso, Costos) y la columna de acciones (Aceptar/Rechazar), cumpliendo con la regla de privacidad que definimos en el componente CitaRow.

Vista del Empleado / Encargado (Secretaría):

Gestión de Citas: La tabla administrativa completa que ya tienes estructurada, mostrando las alertas analíticas de Machine Learning y los botones de acción para el flujo de la clínica.

Panel de Auditoría (PanelAuditoria.jsx): Una nueva sección exclusiva para el supervisor o encargado. Mostrará una tabla estilizada conectada a /api/auditorias que listará cronológicamente las acciones críticas del sistema (quién modificó qué cita, desde qué IP y en qué fecha).

📱 2. Módulo Móvil: Adaptación de la Interfaz
Para la aplicación móvil, el flujo debe ser sumamente rápido y nativo.

Pantallas de Acceso (Auth): Formularios optimizados para teclado móvil, soporte para visualización de contraseña (icono de ojo) y validaciones instantáneas antes de enviar los datos al endpoint /api/auth/login.

Flujo del Paciente: Una botonera limpia o barra de navegación inferior (Bottom Navigation Bar) que le permita:

Solicitar una nueva cita de manera ágil.

Consultar el estado actual de sus citas en tiempo real (ver si fue Aceptada, Rechazada o Reprogramada por la secretaría).

Flujo del Empleado: Si un encargado inicia sesión desde el móvil, la interfaz se adaptará para mostrar notificaciones rápidas y una lista de auditoría compacta adaptada a pantallas verticales mediante tarjetas (Cards) en lugar de tablas anchas.

🎨 3. Plan de Mejora Estética y Visual
Para que el diseño deje de verse plano y adquiera un aspecto de software empresarial moderno, implementaremos las siguientes mejoras visuales:

Paleta de Colores Médica y Profesional:

Azul Principal (#2c3e50 o #1a73e8): Transmite confianza y autoridad clínica.

Fondos Limpios (#f8f9fa): Reemplazar los fondos blancos planos por grises médicos muy tenues para reducir la fatiga visual.

Alertas Semafóricas de IA: Mantener y refinar los bloques de color redondeados (badges) para el riesgo de inasistencia (Verde para Bajo, Naranja para Medio, Rojo para Alto) para una lectura intuitiva de un solo vistazo.

Sombras y Tarjetas (Cards): Envolver los formularios y las tablas dentro de contenedores con bordes ligeramente redondeados (border-radius: 8px) y sombras tenues (box-shadow: 0 4px 6px rgba(0,0,0,0.1)) para dar una sensación de profundidad.



📊 1. Diseño del Panel de Auditoría (PanelAuditoria.jsx)
Para esta pantalla utilizaremos un diseño de tablero (Dashboard) corporativo. El encargado o administrador verá tarjetas informativas con métricas rápidas arriba y una tabla de datos de alta densidad abajo.


🔐 2. Diseño de la Tarjeta Unificada de Autenticación (Web)
Para que el Login, Registro y Recuperación sigan una misma línea visual sofisticada, utilizaremos una maquetación con efecto de cristalización ligera sobre fondos degradados médicos.

🗂️ Estructura Completa Recomendada para las Vistas de Autenticación
Para que no nos perdamos, las pantallas reales (las páginas completas que el usuario ve) deben ir en una carpeta llamada views/ o pages/. Así es como se organizará tu frontend de manera profesional:

Plaintext
src/
├── components/
│   ├── CitaRow.jsx            <-- El que ya tienes listo con los roles
│   ├── FormReprogramar.jsx    <-- El que ya tienes listo
│   ├── PanelAuditoria.jsx     <-- El que creaste (guardado para usarlo después)
│   └── AuthCardContainer.jsx  <-- 🌟 AQUÍ VA TU NUEVA TARJETA DE AUTENTICACIÓN
│
└── views/ (o pages/)
    ├── Login.jsx              <-- Pantalla de Inicio de Sesión
    ├── Register.jsx           <-- Pantalla de Registro de Pacientes
    └── ForgotPassword.jsx     <-- Pantalla de Recuperar Contraseña