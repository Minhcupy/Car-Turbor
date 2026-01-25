package com.example.autostore.dto.admin;

import java.time.OffsetDateTime;

public record AdminFaceDTO(
        Long userId,
        boolean registered,
        String model,
        Integer dim,
        String version,
        Float qualityScore,
        OffsetDateTime createdAt
) {}
