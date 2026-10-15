package com.medivault.repository;

import com.medivault.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByUserIdOrderByDateDesc(Long userId);

    Optional<MedicalRecord> findByIdAndUserId(Long id, Long userId);
}
