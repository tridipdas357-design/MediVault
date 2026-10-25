package com.medivault.service;

import com.medivault.dto.AppointmentDto;
import com.medivault.dto.MedicationDto;
import com.medivault.dto.RecordDto;
import com.medivault.dto.ShareLinkResponse;
import com.medivault.dto.SharePasswordRequest;
import com.medivault.dto.SharePatientDto;
import com.medivault.dto.ShareSummaryDto;
import com.medivault.exception.BadRequestException;
import com.medivault.exception.InvalidSharePasswordException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.model.User;
import com.medivault.repository.AppointmentRepository;
import com.medivault.repository.MedicationRepository;
import com.medivault.repository.RecordRepository;
import com.medivault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

@Service
public class ShareService {

    private final UserRepository userRepository;
    private final RecordRepository recordRepository;
    private final MedicationRepository medicationRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public ShareService(
            UserRepository userRepository,
            RecordRepository recordRepository,
            MedicationRepository medicationRepository,
            AppointmentRepository appointmentRepository,
            UserService userService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
        this.medicationRepository = medicationRepository;
        this.appointmentRepository = appointmentRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ShareLinkResponse getOrCreateLink(Long userId) {
        User user = userService.requireUser(userId);
        if (user.getShareToken() == null || user.getShareToken().isBlank()) {
            user.setShareToken(newToken());
            user = userRepository.save(user);
        }
        return toLinkResponse(user);
    }

    @Transactional
    public ShareLinkResponse rotateLink(Long userId) {
        User user = userService.requireUser(userId);
        user.setShareToken(newToken());
        return toLinkResponse(userRepository.save(user));
    }

    @Transactional
    public ShareLinkResponse setPassword(Long userId, SharePasswordRequest request) {
        String password = request.getPassword();
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new BadRequestException("Share password must be no longer than 72 UTF-8 bytes");
        }
        User user = userService.requireUser(userId);
        user.setSharePasswordHash(passwordEncoder.encode(password));
        return toLinkResponse(userRepository.save(user));
    }

    public ShareSummaryDto getSummary(String token, SharePasswordRequest request) {
        if (token == null || token.isBlank()) {
            throw new ResourceNotFoundException("This share link is invalid");
        }
        User user = userRepository.findByShareToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("This share link is invalid or has been revoked"));
        String passwordHash = user.getSharePasswordHash();
        if (passwordHash == null || !passwordEncoder.matches(request.getPassword(), passwordHash)) {
            throw new InvalidSharePasswordException();
        }

        ShareSummaryDto summary = new ShareSummaryDto();
        summary.setGeneratedAt(Instant.now());
        summary.setPatient(SharePatientDto.from(user));
        summary.setRecords(
                recordRepository.findByUserIdOrderByDateDesc(user.getId()).stream().map(RecordDto::from).toList()
        );
        summary.setMedications(
                medicationRepository.findByUserId(user.getId()).stream().map(MedicationDto::from).toList()
        );
        summary.setAppointments(
                appointmentRepository.findByUserIdOrderByDateAscTimeAsc(user.getId()).stream()
                        .map(AppointmentDto::from)
                        .toList()
        );
        return summary;
    }

    private ShareLinkResponse toLinkResponse(User user) {
        return new ShareLinkResponse(user.getShareToken(), user.getSharePasswordHash() != null);
    }

    private String newToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
