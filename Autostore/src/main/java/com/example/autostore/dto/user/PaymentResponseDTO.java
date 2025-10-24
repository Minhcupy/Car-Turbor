package com.example.autostore.dto.user;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Integer paymentId;
    private Integer bookingId;
    private Double amount;
    private String status;
    private String method;
    private String payerName;
    private String payerEmail;
    private String payerPhone;
    private String qrBase64;   // thêm khi simulate hoặc get QR
}
