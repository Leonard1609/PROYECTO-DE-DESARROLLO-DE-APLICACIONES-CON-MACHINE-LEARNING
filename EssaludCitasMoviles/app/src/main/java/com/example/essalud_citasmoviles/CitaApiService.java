package com.example.essalud_citasmoviles;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface CitaApiService {
    // Definición de la ruta POST apuntando a la creación de citas
    @POST("api/citas")
    Call<Cita> enviarCita(@Body Cita cita);

    // 🔥 NUEVA RUTA PARA VALIDAR USUARIOS DE LA WEB
    @POST("api/auth/login")
    Call<LoginResponse> iniciarSesion(@Body LoginRequest request);
}