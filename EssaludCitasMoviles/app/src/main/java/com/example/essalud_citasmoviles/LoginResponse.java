package com.example.essalud_citasmoviles;

public class LoginResponse {
    private String token;
    private Usuario usuario;

    public String getToken() { return token; }
    public Usuario getUsuario() { return usuario; }

    public static class Usuario {
        private String nombre;
        private String correo;
        private String rol;

        public String getNombre() { return nombre; }
        public String getCorreo() { return correo; }
        public String getRol() { return rol; }
    }
}