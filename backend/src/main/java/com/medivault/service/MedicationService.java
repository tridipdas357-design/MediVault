package com.medivault.service;

import com.medivault.dto.MedicationDto;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.model.Medication;
import com.medivault.model.User;
import com.medivault.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final UserService userService;

    public MedicationService(MedicationRepository medicationRepository, UserService userService) {
        this.medicationRepository = medicationRepository;
        this.userService = userService;
    }

    public List<MedicationDto> list(Long userId) {
        return medicationRepository.findByUserId(userId).stream()
                .map(MedicationDto::from)
                .toList();
    }

    public MedicationDto get(Long userId, Long id) {
        return MedicationDto.from(requireOwned(userId, id));
    }

    @Transactional
    public MedicationDto create(Long userId, MedicationDto dto) {
        User user = userService.requireUser(userId);
        Medication medication = new Medication();
        medication.setUser(user);
        apply(medication, dto);
        return MedicationDto.from(medicationRepository.save(medication));
    }

    @Transactional
    public MedicationDto update(Long userId, Long id, MedicationDto dto) {
        Medication medication = requireOwned(userId, id);
        apply(medication, dto);
        return MedicationDto.from(medicationRepository.save(medication));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        Medication medication = requireOwned(userId, id);
        medicationRepository.deleteById(medication.getId());
    }

    private Medication requireOwned(Long userId, Long id) {
        return medicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));
    }

    private void apply(Medication medication, MedicationDto dto) {
        medication.setName(dto.getName().trim());
        medication.setDosage(blankToNull(dto.getDosage()));
        medication.setFrequency(blankToNull(dto.getFrequency()));
        medication.setStartDate(dto.getStartDate());
        medication.setActive(dto.isActive());
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
