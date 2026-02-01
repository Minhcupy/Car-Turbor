package com.example.autostore.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "login_otp", indexes = {
        @Index(name = "idx_login_otp_user", columnList = "userId"),
        @Index(name = "idx_login_otp_expires", columnList = "expiresAt")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class LoginOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false, length = 200)
    private String otpHash;

    @Column(nullable = false)
    private OffsetDateTime expiresAt;

    private OffsetDateTime usedAt;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
