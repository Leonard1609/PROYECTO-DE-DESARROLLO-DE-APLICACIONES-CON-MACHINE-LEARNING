package com.example.essalud_citasmoviles;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private EditText etFecha, etHora;
    private CitaApiService apiService;

    // 🔒 DATOS AUTÉNTICOS DEL PACIENTE EXTRAÍDOS DESDE EL LOGIN
    private String usuarioLogueado;
    private String correoLogueado;
    private String rolLogueado;

    // 🛡️ SISTEMA DE REGULACIÓN ANTI-SOBRECARGA PERSISTENTE
    private boolean estaProcesando = false;
    private SharedPreferences sharedPreferences;
    private Set<String> citasAgendadasLocales;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 📩 CAPTURAMOS LA SESIÓN DE LA CUENTA WEB REAL
        usuarioLogueado = getIntent().getStringExtra("USER_NAME");
        correoLogueado = getIntent().getStringExtra("USER_EMAIL");
        rolLogueado = getIntent().getStringExtra("USER_ROLE");

        // Alerta preventiva en consola si el login manda datos vacíos
        if (correoLogueado == null || correoLogueado.isEmpty()) {
            Log.e("DATABASE_WARN", "Alerta: El Intent no recibió un correo real desde el Login.");
            correoLogueado = "paciente@essalud.gob.pe";
        }
        if (usuarioLogueado == null) usuarioLogueado = "Paciente";

        // 💾 INICIALIZAR EL ARCHIVO DE ALMACENAMIENTO LOCAL SEGURO
        sharedPreferences = getSharedPreferences("ControlCitasEsSalud", Context.MODE_PRIVATE);
        // Recuperamos el historial guardado en el disco del teléfono (si no existe, crea uno vacío)
        Set<String> historialGuardado = sharedPreferences.getStringSet("historial_firmas", new HashSet<>());
        citasAgendadasLocales = new HashSet<>(historialGuardado);

        etFecha = findViewById(R.id.etFecha);
        etHora = findViewById(R.id.etHora);

        etFecha.setOnClickListener(v -> mostrarDatePicker());
        etHora.setOnClickListener(v -> mostrarTimePicker());

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        apiService = retrofit.create(CitaApiService.class);

        // Clics interactivos de las tarjetas
        findViewById(R.id.btnMedicina).setOnClickListener(v -> procesarCitaUnClic("Medicina General"));
        findViewById(R.id.btnPediatria).setOnClickListener(v -> procesarCitaUnClic("Pediatria"));
        findViewById(R.id.btnOdontologia).setOnClickListener(v -> procesarCitaUnClic("Odontologia"));
        findViewById(R.id.btnDermatologia).setOnClickListener(v -> procesarCitaUnClic("Dermatologia"));
        findViewById(R.id.btnCardiologia).setOnClickListener(v -> procesarCitaUnClic("Cardiologia"));
    }

    private void mostrarDatePicker() {
        final Calendar c = Calendar.getInstance();
        int año = c.get(Calendar.YEAR);
        int mes = c.get(Calendar.MONTH);
        int dia = c.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(this,
                (view, year, monthOfYear, dayOfMonth) -> {
                    String fechaFormateada = String.format(Locale.US, "%04d-%02d-%02d", year, (monthOfYear + 1), dayOfMonth);
                    etFecha.setText(fechaFormateada);
                }, año, mes, dia);
        datePickerDialog.show();
    }

    private void mostrarTimePicker() {
        final Calendar c = Calendar.getInstance();
        int hora = c.get(Calendar.HOUR_OF_DAY);
        int minuto = c.get(Calendar.MINUTE);

        TimePickerDialog timePickerDialog = new TimePickerDialog(this,
                (view, hourOfDay, minute) -> {
                    String horaFormateada = String.format(Locale.US, "%02d:%02d", hourOfDay, minute);
                    etHora.setText(horaFormateada);
                }, hora, minuto, true);
        timePickerDialog.show();
    }

    private void procesarCitaUnClic(String especialidadSeleccionada) {
        if (estaProcesando) {
            Toast.makeText(this, "⏳ Procesando solicitud... Por favor espere.", Toast.LENGTH_SHORT).show();
            return;
        }

        String fecha = etFecha.getText().toString().trim();
        String hora = etHora.getText().toString().trim();

        if (fecha.isEmpty() || hora.isEmpty()) {
            Toast.makeText(this, "⚠️ Seleccione Fecha y Hora antes de agendar.", Toast.LENGTH_SHORT).show();
            return;
        }

        // 🔐 GENERAMOS UNA FIRMA ÚNICA ASOCIADA A ESTE USUARIO ESPECÍFICO
        // Formato de la firma: correo_especialidad_fecha_hora
        String identificadorCita = correoLogueado + "_" + especialidadSeleccionada + "_" + fecha + "_" + hora;

        // El dispositivo recuerda la firma incluso si el usuario cerró y volvió a abrir la app
        if (citasAgendadasLocales.contains(identificadorCita)) {
            Toast.makeText(this, "❌ Bloqueo Anti-Spam: Ya registraste una cita idéntica en este horario.", Toast.LENGTH_LONG).show();
            return;
        }

        estaProcesando = true;

        Cita nuevaCita = new Cita(usuarioLogueado, correoLogueado, fecha, hora, especialidadSeleccionada);

        Call<Cita> call = apiService.enviarCita(nuevaCita);
        call.enqueue(new Callback<Cita>() {
            @Override
            public void onResponse(Call<Cita> call, Response<Cita> response) {
                estaProcesando = false;

                try {
                    if (response.isSuccessful() && response.body() != null) {
                        Cita resultado = response.body();

                        // 💾 AGREGAMOS LA FIRMA Y LA ESCRIBIMOS EN EL DISCO LOCAL DE FORMA PERMANENTE
                        citasAgendadasLocales.add(identificadorCita);
                        sharedPreferences.edit().putStringSet("historial_firmas", citasAgendadasLocales).apply();

                        String mensajeConfirmacion = String.format(Locale.US,
                                "✅ ¡CITA RESERVADA EXITOSAMENTE!\n\n" +
                                        "👤 Paciente: %s\n" +
                                        "📧 Correo: %s\n" +
                                        "🩺 Especialidad: %s\n" +
                                        "📅 Horario: %s a las %s\n\n" +
                                        "🤖 Riesgo de Inasistencia (ML): %d%% (%s)",
                                usuarioLogueado,
                                correoLogueado,
                                resultado.getEspecialidad(),
                                resultado.getFecha(),
                                resultado.getHora(),
                                resultado.getProbInasistencia(),
                                (resultado.getProbInasistencia() > 50 ? "Alto" : "Bajo")
                        );

                        Toast.makeText(MainActivity.this, mensajeConfirmacion, Toast.LENGTH_LONG).show();
                    } else {
                        Toast.makeText(MainActivity.this, "Error: Problema de procesamiento en EsSalud.", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    Log.e("MOBILE_LAYOUT", "Error de renderizado: " + e.getMessage());
                }
            }

            @Override
            public void onFailure(Call<Cita> call, Throwable t) {
                estaProcesando = false;
                Toast.makeText(MainActivity.this, "Error de Red: Servidor fuera de línea.", Toast.LENGTH_SHORT).show();
            }
        });
    }
}