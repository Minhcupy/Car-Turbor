package com.example.autostore.dto;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
public class SignInOtpResponse {
    private boolean requiresOtp;
    private String otpToken;
    private int expiresIn;
    private String maskedEmail;
}
