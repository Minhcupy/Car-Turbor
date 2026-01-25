package com.example.autostore.dto.user;

public record FaceVerifyResponse(boolean verified, String faceVerifiedToken) {}