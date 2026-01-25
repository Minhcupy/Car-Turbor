package com.example.autostore.dto.user;

import lombok.Data;

@Data
public class SignElectronicRequest {
    private String signaturePngBase64; // data:image/png;base64,...
    private String signerName;
    private boolean consent;
}