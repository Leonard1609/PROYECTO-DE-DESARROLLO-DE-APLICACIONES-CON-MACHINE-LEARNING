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