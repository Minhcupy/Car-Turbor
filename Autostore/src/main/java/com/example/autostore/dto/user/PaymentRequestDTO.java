package com.example.autostore.dto.user;

import com.example.autostore.Enum.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Integer bookingId;
    private Double amount;
    private PaymentMethod paymentMethod;
    private String payerName;
    private String payerPhone;
    private String payerEmail;
}
