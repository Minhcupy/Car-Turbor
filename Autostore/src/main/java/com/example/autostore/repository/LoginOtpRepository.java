package com.example.autostore.repository;

import com.example.autostore.model.LoginOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginOtpRepository extends JpaRepository<LoginOtp, Long> {
    Optional<LoginOtp> findTopByUserIdOrderByCreatedAtDesc(Integer userId);
}
