package com.medivault.service;

import com.medivault.dto.AppointmentDto;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.model.Appointment;
import com.medivault.model.User;
import com.medivault.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserService userService;

    public AppointmentService(AppointmentRepository appointmentRepository, UserService userService) {
        this.appointmentRepository = appointmentRepository;
        this.userService = userService;
    }

    public List<AppointmentDto> list(Long userId) {
        return appointmentRepository.findByUserIdOrderByDateAscTimeAsc(userId).stream()
                .map(AppointmentDto::from)
                .toList();
    }

    public AppointmentDto get(Long userId, Long id) {
        return AppointmentDto.from(requireOwned(userId, id));
    }

    @Transactional
    public AppointmentDto create(Long userId, AppointmentDto dto) {
        User user = userService.requireUser(userId);
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        apply(appointment, dto);
        return AppointmentDto.from(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDto update(Long userId, Long id, AppointmentDto dto) {
        Appointment appointment = requireOwned(userId, id);
        apply(appointment, dto);
        return AppointmentDto.from(appointmentRepository.save(appointment));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        Appointment appointment = requireOwned(userId, id);
        appointmentRepository.deleteById(appointment.getId());
    }

    private Appointment requireOwned(Long userId, Long id) {
        return appointmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    private void apply(Appointment appointment, AppointmentDto dto) {
        appointment.setDoctor(dto.getDoctor().trim());
        appointment.setSpecialty(blankToNull(dto.getSpecialty()));
        appointment.setDate(dto.getDate());
        appointment.setTime(dto.getTime());
        appointment.setLocation(blankToNull(dto.getLocation()));
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
