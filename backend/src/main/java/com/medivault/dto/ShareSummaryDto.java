package com.medivault.dto;

import java.time.Instant;
import java.util.List;

public class ShareSummaryDto {

    private Instant generatedAt;
    private SharePatientDto patient;
    private List<RecordDto> records;
    private List<MedicationDto> medications;
    private List<AppointmentDto> appointments;

    public Instant getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(Instant generatedAt) {
        this.generatedAt = generatedAt;
    }

    public SharePatientDto getPatient() {
        return patient;
    }

    public void setPatient(SharePatientDto patient) {
        this.patient = patient;
    }

    public List<RecordDto> getRecords() {
        return records;
    }

    public void setRecords(List<RecordDto> records) {
        this.records = records;
    }

    public List<MedicationDto> getMedications() {
        return medications;
    }

    public void setMedications(List<MedicationDto> medications) {
        this.medications = medications;
    }

    public List<AppointmentDto> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<AppointmentDto> appointments) {
        this.appointments = appointments;
    }
}
