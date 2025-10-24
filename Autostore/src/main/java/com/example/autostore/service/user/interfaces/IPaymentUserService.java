package com.example.autostore.service.user.interfaces;

import com.example.autostore.dto.user.PaymentRequestDTO;
import com.example.autostore.model.Payment;

import java.util.Map;

public interface IPaymentUserService {
    Map<String, Object> simulatePayAndGenerateQR(Integer paymentId);
    Map<String, Object> getPaymentQR(Integer paymentId);

    Payment createPayment(PaymentRequestDTO dto, String username);
}
