package com.example.autostore.dto.user;

import java.util.List;

public record FaceChallengeResponse(String challengeId, String expiresAt, List<String> steps) {}
