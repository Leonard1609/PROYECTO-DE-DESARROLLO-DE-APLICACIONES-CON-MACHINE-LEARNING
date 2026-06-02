package com.example.essalud_citasmoviles;

public class Cita {
    private String paciente;
    private String correo_paciente;
    private String fecha;
    private String hora;
    private String especialidad; // Coincide perfectamente con el body del backend
    private String estado;

    // 🔥 NUEVOS CAMPOS INTEGRADOS NATIVAMENTE DESDE EL MOTOR DE MACHINE LEARNING
    private int prob_inasistencia;
    private int prob_reingreso;
    private double costo_estimado;

    // Constructor para crear la cita desde el formulario móvil
    public Cita(String paciente, String correo_paciente, String fecha, String hora, String especialidad) {
        this.paciente = paciente;
        this.correo_paciente = correo_paciente;
        this.fecha = fecha;
        this.hora = hora;
        this.especialidad = especialidad;
        this.estado = "Pendiente";
    }

    // Getters y Setters
    public String getPaciente() { return paciente; }
    public String getCorreoPaciente() { return correo_paciente; }
    public String getFecha() { return fecha; }
    public String getHora() { return hora; }
    public String getEspecialidad() { return especialidad; }
    public String getEstado() { return estado; }

    // 🔥 Getters de Inteligencia Artificial para las interfaces
    public int getProbInasistencia() { return prob_inasistencia; }
    public int getProbReingreso() { return prob_reingreso; }
    public double getCostoEstimado() { return costo_estimado; }
}