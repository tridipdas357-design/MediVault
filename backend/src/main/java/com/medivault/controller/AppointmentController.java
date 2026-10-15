package com.medivault.controller;

import com.medivault.dto.AppointmentDto;
import com.medivault.security.CurrentUser;
import com.medivault.service.AppointmentService;
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
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final CurrentUser currentUser;

    public AppointmentController(AppointmentService appointmentService, CurrentUser currentUser) {
        this.appointmentService = appointmentService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<AppointmentDto> list() {
        return appointmentService.list(currentUser.requireId());
    }

    @GetMapping("/{id}")
    public AppointmentDto get(@PathVariable Long id) {
        return appointmentService.get(currentUser.requireId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentDto create(@Valid @RequestBody AppointmentDto dto) {
        return appointmentService.create(currentUser.requireId(), dto);
    }

    @PutMapping("/{id}")
    public AppointmentDto update(@PathVariable Long id, @Valid @RequestBody AppointmentDto dto) {
        return appointmentService.update(currentUser.requireId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        appointmentService.delete(currentUser.requireId(), id);
    }
}
