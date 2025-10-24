package com.example.autostore.controller.users;

import com.example.autostore.dto.user.PaymentRequestDTO;
import com.example.autostore.dto.user.PaymentResponseDTO;
import com.example.autostore.model.Payment;
import com.example.autostore.service.user.interfaces.IPaymentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/user/payments")
@RequiredArgsConstructor
public class PaymentUserController {

    private final IPaymentUserService paymentUserService;

    /**
     * Tạo Payment mới cho 1 booking
     */
    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(@RequestBody PaymentRequestDTO dto, Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        Payment payment = paymentUserService.createPayment(dto, username);

        PaymentResponseDTO resp = new PaymentResponseDTO(
                payment.getPaymentId(),
                payment.getBooking().getBookingId(),
                payment.getAmount(),
                payment.getStatus().name(),
                payment.getPaymentMethod().name(),
                payment.getPayerName(),
                payment.getPayerEmail(),
                payment.getPayerPhone(),
                null
        );

        return ResponseEntity.ok(resp);
    }

    /**
     * Giả lập thanh toán thành công → sinh QR
     */
    @PostMapping("/{paymentId}/simulate-pay")
    public ResponseEntity<PaymentResponseDTO> simulatePay(@PathVariable Integer paymentId) {
        Map<String, Object> result = paymentUserService.simulatePayAndGenerateQR(paymentId);

        Map<String, Object> paymentMap = (Map<String, Object>) result.get("payment");
        String qrBase64 = (String) result.get("qrBase64");

        PaymentResponseDTO resp = new PaymentResponseDTO(
                (Integer) paymentMap.get("paymentId"),
                (Integer) paymentMap.get("bookingId"),
                (Double) paymentMap.get("amount"),
                (String) paymentMap.get("status"),
                (String) paymentMap.get("method"),
                (String) paymentMap.get("payerName"),
                (String) paymentMap.get("payerEmail"),
                (String) paymentMap.get("payerPhone"),
                qrBase64
        );

        return ResponseEntity.ok(resp);
    }

    /**
     * Lấy QR dưới dạng ảnh PNG (dùng cho <img src="..."> trực tiếp)
     */
    @GetMapping("/{paymentId}/qrcode")
    public ResponseEntity<byte[]> getPaymentQrPng(@PathVariable Integer paymentId) {
        Map<String, Object> result = paymentUserService.getPaymentQR(paymentId);
        String base64 = (String) result.get("qrBase64");
        byte[] png = Base64.getDecoder().decode(base64);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/png")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=payment_" + paymentId + "_qrcode.png")
                .body(png);
    }
}
