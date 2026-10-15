package com.medivault.controller;

import com.medivault.dto.MedicationDto;
import com.medivault.security.CurrentUser;
import com.medivault.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;
    private final CurrentUser currentUser;

    public MedicationController(MedicationService medicationService, CurrentUser currentUser) {
        this.medicationService = medicationService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<MedicationDto> list() {
        return medicationService.list(currentUser.requireId());
    }

    @GetMapping("/{id}")
    public MedicationDto get(@PathVariable Long id) {
        return medicationService.get(currentUser.requireId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicationDto create(@Valid @RequestBody MedicationDto dto) {
        return medicationService.create(currentUser.requireId(), dto);
    }

    @PutMapping("/{id}")
    public MedicationDto update(@PathVariable Long id, @Valid @RequestBody MedicationDto dto) {
        return medicationService.update(currentUser.requireId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        medicationService.delete(currentUser.requireId(), id);
    }
}
