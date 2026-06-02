package com.example.essalud_citasmoviles;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LoginActivity extends AppCompatActivity {

    private EditText etCorreo, etPassword;
    private Button btnIngresar;
    private CitaApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etCorreo = findViewById(R.id.etLoginCorreo);
        etPassword = findViewById(R.id.etLoginPassword);
        btnIngresar = findViewById(R.id.btnLoginIngresar);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        apiService = retrofit.create(CitaApiService.class);

        btnIngresar.setOnClickListener(v -> ejecutarAutenticacion());
    }

    private void ejecutarAutenticacion() {
        // 📧 Capturamos de forma limpia lo que el usuario digita en pantalla
        String correo = etCorreo.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (correo.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Por favor complete sus credenciales", Toast.LENGTH_SHORT).show();
            return;
        }

        LoginRequest request = new LoginRequest(correo, password);
        Call<LoginResponse> call = apiService.iniciarSesion(request);

        call.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    LoginResponse.Usuario usuarioWeb = response.body().getUsuario();
                    String rol = usuarioWeb.getRol() != null ? usuarioWeb.getRol().toLowerCase() : "paciente";

                    // 🛑 FILTRO DE ROL: Solo permitimos el acceso al flujo de Citas Móviles a Pacientes/Clientes
                    if (rol.equals("medico") || rol.equals("secretaria") || rol.equals("admin")) {
                        Toast.makeText(LoginActivity.this,
                                "⚠️ Acceso restringido: El personal administrativo y médico debe usar el portal Web.",
                                Toast.LENGTH_LONG).show();
                        return; // Detiene el flujo y no salta a la MainActivity
                    }

                    // 🟢 Si es un cliente/paciente regular, avanza con total normalidad
                    Toast.makeText(LoginActivity.this, "¡Bienvenido " + usuarioWeb.getNombre() + "!", Toast.LENGTH_SHORT).show();

                    // 🎯 SOLUCIÓN AL CORREO FANTASMA:
                    // Si usuarioWeb.getCorreo() viene vacío o null por el mapeo, le asignamos la variable local 'correo'
                    // que fue con la que se autenticó exitosamente en el formulario de login.
                    String correoFinal = (usuarioWeb.getCorreo() != null && !usuarioWeb.getCorreo().isEmpty())
                            ? usuarioWeb.getCorreo()
                            : correo;

                    Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    intent.putExtra("USER_NAME", usuarioWeb.getNombre());
                    intent.putExtra("USER_EMAIL", correoFinal); // 🚀 Pasamos el correo verificado y garantizado
                    intent.putExtra("USER_ROLE", usuarioWeb.getRol());
                    startActivity(intent);
                    finish(); // Cierra el login para que no pueda volver atrás con el botón físico
                } else {
                    Toast.makeText(LoginActivity.this, "Credenciales incorrectas de EsSalud", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Toast.makeText(LoginActivity.this, "Fallo de conexión: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}