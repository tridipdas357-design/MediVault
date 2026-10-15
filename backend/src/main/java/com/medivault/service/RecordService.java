package com.medivault.service;

import com.medivault.dto.RecordDto;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.model.MedicalRecord;
import com.medivault.model.User;
import com.medivault.repository.RecordRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public RecordService(
            RecordRepository recordRepository,
            UserService userService,
            FileStorageService fileStorageService
    ) {
        this.recordRepository = recordRepository;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    public List<RecordDto> list(Long userId) {
        return recordRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(RecordDto::from)
                .toList();
    }

    public RecordDto get(Long userId, Long id) {
        return RecordDto.from(requireOwned(userId, id));
    }

    @Transactional
    public RecordDto create(Long userId, RecordDto dto) {
        User user = userService.requireUser(userId);
        MedicalRecord record = new MedicalRecord();
        record.setUser(user);
        apply(record, dto);
        return RecordDto.from(recordRepository.save(record));
    }

    @Transactional
    public RecordDto update(Long userId, Long id, RecordDto dto) {
        MedicalRecord record = requireOwned(userId, id);
        apply(record, dto);
        return RecordDto.from(recordRepository.save(record));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        MedicalRecord record = requireOwned(userId, id);
        fileStorageService.deleteIfPresent(record.getFileUrl());
        recordRepository.deleteById(record.getId());
    }

    @Transactional
    public RecordDto attachFile(Long userId, Long id, MultipartFile file) {
        MedicalRecord record = requireOwned(userId, id);
        fileStorageService.deleteIfPresent(record.getFileUrl());
        record.setFileUrl(fileStorageService.store(file));
        return RecordDto.from(recordRepository.save(record));
    }

    public Resource loadFile(Long userId, Long id) {
        MedicalRecord record = requireOwned(userId, id);
        Path path = fileStorageService.resolve(record.getFileUrl());
        return new FileSystemResource(path);
    }

    private MedicalRecord requireOwned(Long userId, Long id) {
        return recordRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));
    }

    private void apply(MedicalRecord record, RecordDto dto) {
        record.setTitle(dto.getTitle().trim());
        record.setType(dto.getType());
        record.setDoctor(blankToNull(dto.getDoctor()));
        record.setDate(dto.getDate());
        record.setNotes(blankToNull(dto.getNotes()));
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
