package com.medivault.dto;

import com.medivault.model.MedicalRecord;
import com.medivault.model.RecordType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class RecordDto {

    private Long id;

    @NotBlank
    private String title;

    @NotNull
    private RecordType type;

    private String doctor;

    @NotNull
    private LocalDate date;

    private String notes;
    private String fileUrl;

    public static RecordDto from(MedicalRecord record) {
        RecordDto dto = new RecordDto();
        dto.setId(record.getId());
        dto.setTitle(record.getTitle());
        dto.setType(record.getType());
        dto.setDoctor(record.getDoctor());
        dto.setDate(record.getDate());
        dto.setNotes(record.getNotes());
        dto.setFileUrl(record.getFileUrl());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public RecordType getType() {
        return type;
    }

    public void setType(RecordType type) {
        this.type = type;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}
