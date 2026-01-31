package com.example.autostore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FaceEnrolledResponse {
    private boolean registered;
    private long userId;
}
