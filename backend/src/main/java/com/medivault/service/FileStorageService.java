package com.medivault.service;

import com.medivault.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED = Set.of("pdf", "png", "jpg", "jpeg", "webp");

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadRoot);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create upload directory", ex);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("A file is required");
        }
        String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String ext = extension(original);
        if (!ALLOWED.contains(ext)) {
            throw new BadRequestException("Only PDF and image files are allowed");
        }
        String filename = UUID.randomUUID() + "." + ext;
        Path target = uploadRoot.resolve(filename).normalize();
        if (!target.startsWith(uploadRoot)) {
            throw new BadRequestException("Invalid file path");
        }
        try {
            Files.copy(file.getInputStream(), target);
        } catch (IOException ex) {
            throw new BadRequestException("Could not store the file");
        }
        return "/uploads/" + filename;
    }

    public void deleteIfPresent(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }
        String name = Path.of(fileUrl).getFileName().toString();
        Path target = uploadRoot.resolve(name).normalize();
        try {
            if (target.startsWith(uploadRoot)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ignored) {
            // best-effort cleanup
        }
    }

    public Path resolve(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new BadRequestException("This record has no attached file");
        }
        String name = Path.of(fileUrl).getFileName().toString();
        Path target = uploadRoot.resolve(name).normalize();
        if (!target.startsWith(uploadRoot) || !Files.exists(target)) {
            throw new BadRequestException("Attached file was not found");
        }
        return target;
    }

    private String extension(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot < 0) {
            return "";
        }
        return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
}
