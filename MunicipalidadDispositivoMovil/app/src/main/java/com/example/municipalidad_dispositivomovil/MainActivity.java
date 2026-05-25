package com.example.municipalidad_dispositivomovil;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

// Importaciones explícitas de Volley para evitar errores de métodos abstractos
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    private static final String CHANNEL_ID = "alertas_ciudadanas";

    // 🔍 REEMPLAZA EL "192.168.1.X" POR LA DIRECCIÓN IP DE TU COMPUTADORA
    private static final String URL_API = "http://192.168.18.6:5000/api/tramites";

    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        createNotificationChannel();
        verificarPermisoNotificaciones();

        // Inicializar la cola de red de Volley
        requestQueue = Volley.newRequestQueue(this);

        final EditText etTipoTramite = findViewById(R.id.etTipoTramite);
        final EditText etDescripcion = findViewById(R.id.etDescripcion);
        Button btnEnviarTramite = findViewById(R.id.btnEnviarTramite);

        btnEnviarTramite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String tramite = etTipoTramite.getText().toString().trim();
                String desc = etDescripcion.getText().toString().trim();

                if (!tramite.isEmpty() && !desc.isEmpty()) {
                    // Llamar a la función que guarda los datos en MySQL
                    enviarTramiteAlServidor(tramite, desc);

                    // Limpiar el formulario
                    etTipoTramite.setText("");
                    etDescripcion.setText("");
                } else {
                    Toast.makeText(MainActivity.this,
                            "Por favor, complete todos los campos.",
                            Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    /**
     * Envía la solicitud mediante una petición HTTP POST al backend en Node.js
     */
    private void enviarTramiteAlServidor(final String tipoTramite, String descripcion) {
        Toast.makeText(this, "Conectando con el servidor municipal...", Toast.LENGTH_SHORT).show();

        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("tipo_tramite", tipoTramite);
            jsonBody.put("descripcion", descripcion);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Configuración estricta de firmas para evitar conflictos de interfaces abstractas
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.POST,
                URL_API,
                jsonBody,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            String mensajeServer = response.getString("message");
                            Toast.makeText(MainActivity.this, "✅ " + mensajeServer, Toast.LENGTH_LONG).show();

                            // Mostrar la alerta nativa en la barra del teléfono
                            mostrarAlertaEstado("Tu trámite de '" + tipoTramite + "' ha sido registrado con éxito.");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(MainActivity.this, "❌ Error de conexión: Verifica que tu backend esté encendido.", Toast.LENGTH_LONG).show();
                        error.printStackTrace();
                    }
                }
        );

        // Añadir la petición a la cola de procesamiento
        requestQueue.add(jsonObjectRequest);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Alertas del Estado de Trámites";
            String description = "Notificaciones en tiempo real sobre sus solicitudes";
            int importance = NotificationManager.IMPORTANCE_HIGH;

            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private void verificarPermisoNotificaciones() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }
    }

    private void mostrarAlertaEstado(String mensaje) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Municipalidad de Yau - Alerta")
                .setContentText(mensaje)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager != null) {
            notificationManager.notify(1, builder.build());
        }
    }
}