package com.medivault.controller;

import com.medivault.dto.RecordDto;
import com.medivault.security.CurrentUser;
import com.medivault.service.RecordService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    private final RecordService recordService;
    private final CurrentUser currentUser;

    public RecordController(RecordService recordService, CurrentUser currentUser) {
        this.recordService = recordService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<RecordDto> list() {
        return recordService.list(currentUser.requireId());
    }

    @GetMapping("/{id}")
    public RecordDto get(@PathVariable Long id) {
        return recordService.get(currentUser.requireId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecordDto create(@Valid @RequestBody RecordDto dto) {
        return recordService.create(currentUser.requireId(), dto);
    }

    @PutMapping("/{id}")
    public RecordDto update(@PathVariable Long id, @Valid @RequestBody RecordDto dto) {
        return recordService.update(currentUser.requireId(), id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        recordService.delete(currentUser.requireId(), id);
    }

    @PostMapping(value = "/{id}/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public RecordDto upload(@PathVariable Long id, @RequestPart("file") MultipartFile file) {
        return recordService.attachFile(currentUser.requireId(), id, file);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Resource resource = recordService.loadFile(currentUser.requireId(), id);
        String filename = resource.getFilename() == null ? "attachment" : resource.getFilename();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
