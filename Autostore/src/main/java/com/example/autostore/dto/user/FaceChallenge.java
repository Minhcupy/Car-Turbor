package com.example.autostore.dto.user;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class FaceChallenge {
    private String challengeId;
    private long userId;
    private String action;
    private Instant expiresAt;
}