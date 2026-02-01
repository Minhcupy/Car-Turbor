package com.example.autostore.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VerifyOtpRequest {
    private String otpToken;
    private String otp;
}
