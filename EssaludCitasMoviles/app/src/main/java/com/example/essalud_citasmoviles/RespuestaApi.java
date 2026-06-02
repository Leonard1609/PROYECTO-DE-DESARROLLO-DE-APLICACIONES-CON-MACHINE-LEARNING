package com.example.essalud_citasmoviles;

public class RespuestaApi {
    private boolean success;
    private String mensaje;
    private Cita cita;

    public boolean isSuccess() { return success; }
    public String getMensaje() { return mensaje; }
    public Cita getCita() { return cita; }
}
