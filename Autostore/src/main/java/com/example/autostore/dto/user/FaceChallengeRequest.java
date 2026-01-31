package com.example.autostore.dto.user;

import lombok.Data;

@Data
public class FaceChallengeRequest {
    private String action;
    private String resourceId; // optional
}