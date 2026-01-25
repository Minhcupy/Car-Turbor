package com.example.autostore.repository;

import com.example.autostore.model.UserFaceTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserFaceTemplateRepository extends JpaRepository<UserFaceTemplate, Long> {
    Optional<UserFaceTemplate> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

