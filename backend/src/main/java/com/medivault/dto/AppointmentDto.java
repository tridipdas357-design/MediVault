package com.medivault.dto;

import com.medivault.model.Appointment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentDto {

    private Long id;

    @NotBlank
    private String doctor;

    private String specialty;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    private String location;

    public static AppointmentDto from(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setDoctor(appointment.getDoctor());
        dto.setSpecialty(appointment.getSpecialty());
        dto.setDate(appointment.getDate());
        dto.setTime(appointment.getTime());
        dto.setLocation(appointment.getLocation());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
