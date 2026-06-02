# PROYECTO-DE-DESARROLLO-DE-APLICACIONES-CON-MACHINE-LEARNING

📱 Iniciando con el Aplicativo Móvil (Android Studio)

Paso 1: Permisos de Internet y Configuración de Red
En Android, de forma nativa no se permiten conexiones HTTP sin cifrar (como nuestro http://localhost:5000). Para solucionar esto:

Abre tu archivo AndroidManifest.xml en Android Studio.

Agrega el permiso de internet arriba de la etiqueta <application>:

XML
<uses-permission android:name="android.permission.INTERNET" />
Dentro de la etiqueta <application>, permite el tráfico de texto claro añadiendo esta propiedad:

XML
android:usesCleartextTraffic="true"
Paso 2: Agregar Dependencias
En tu archivo build.gradle (Module: app), añade las dependencias para poder usar Retrofit y enviar los datos en formato JSON a tu API:

Groovy
dependencies {
    // Retrofit para peticiones HTTP
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
}
(No olvides darle al botón "Sync Now" en la barra superior de Android Studio para cargar las librerías).

Paso 3: Crear el Modelo de Datos en Java/Kotlin
Debemos mapear los datos que el formulario móvil va a enviar. Crearemos una clase equivalente a nuestro modelo de Mongoose.

🛠️ Estructura en Android Studio (Java)
1. El Modelo de Datos (Cita.java)
Crea una clase llamada Cita. Esta clase representará el objeto JSON que tu backend espera recibir (paciente, correo_paciente, fecha, etc.).

2. La Respuesta del Servidor (RespuestaApi.java)
Cuando guardas una cita, el backend responde con un JSON que contiene un mensaje de confirmación. Necesitamos una clase para capturar esa respuesta.

3. La Interfaz de Red de Retrofit (CitaApiService.java)
Aquí definimos las rutas de nuestro backend a las que Android llamará.

📱 El Formulario (Interfaz de Usuario)
4. El Diseño XML (activity_main.xml)
Crea un formulario básico con campos para el nombre, correo, fecha, hora y especialidad. Reemplaza tu archivo de diseño con este:

⚙️ Lógica de Envío (MainActivity.java)
Aquí configuramos Retrofit.

⚠️ ¡Súper Importante! Cuando ejecutas el backend en tu computadora (localhost:5000), el emulador de Android no entiende localhost porque se refiere al propio teléfono emulado. Para conectarte a tu PC desde el emulador, debes usar la IP especial de puente: http://10.0.2.2:5000/.

🏁 Prueba del Flujo de Datos
Levanta tu backend en la terminal de VS Code (node server.js). Asegúrate de ver el mensaje de que MongoDB está conectado.

Ejecuta tu aplicación en el emulador de Android Studio.

Rellena el formulario y presiona "Solicitar Cita".

Si todo está bien conectado, verás el Toast en el móvil diciendo que tu cita fue enviada para verificación, y si revisas tu base de datos local de MongoDB (usando MongoDB Compass), verás el registro guardado con el estado Pendiente.