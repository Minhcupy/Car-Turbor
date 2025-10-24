package com.example.autostore.service.user.implement;

import com.example.autostore.Enum.PaymentStatus;
import com.example.autostore.dto.user.PaymentRequestDTO;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Payment;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.repository.IPaymentRepository;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.user.interfaces.IPaymentUserService;
import com.example.autostore.util.QRCodeGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentUserService implements IPaymentUserService {

    private final IPaymentRepository paymentRepository;
    private final IBookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Tạo Payment cho 1 Booking
     */
    @Override
    @Transactional
    public Payment createPayment(PaymentRequestDTO dto, String username) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        AppUser user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Payment payment = Payment.builder()
                .booking(booking)
                .appUser(user)
                .amount(dto.getAmount() != null ? dto.getAmount() : booking.getDepositAmount())
                .paymentMethod(dto.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .payerName(dto.getPayerName())
                .payerPhone(dto.getPayerPhone())
                .payerEmail(dto.getPayerEmail())
                .build();

        return paymentRepository.save(payment);
    }

    /**
     * Giả lập thanh toán thành công và sinh QR
     */
    @Override
    @Transactional
    public Map<String, Object> simulatePayAndGenerateQR(Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        return buildQrResponse(payment);
    }

    /**
     * Lấy QR cho Payment (chỉ đọc)
     */
    @Override
    public Map<String, Object> getPaymentQR(Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return buildQrResponse(payment);
    }

    /**
     * Xây dựng payload và sinh QR code
     */
    private Map<String, Object> buildQrResponse(Payment payment) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("paymentId", payment.getPaymentId());
            payload.put("bookingId", payment.getBooking().getBookingId());

            // Người trả tiền
            payload.put("payerName", payment.getPayerName());
            payload.put("payerPhone", payment.getPayerPhone());
            payload.put("payerEmail", payment.getPayerEmail());

            // Thông tin xe + đơn
            payload.put("carName", payment.getBooking().getCar().getCarName());
            payload.put("pickupDate", payment.getBooking().getPickupDate().toString());
            payload.put("returnDate", payment.getBooking().getReturnDate().toString());
            payload.put("amount", payment.getAmount());

            // Status
            String displayStatus = switch (payment.getStatus()) {
                case SUCCESS -> "PAID";
                case FAILED -> "FAILED";
                case REFUNDED -> "REFUNDED";
                default -> "PENDING";
            };
            payload.put("status", displayStatus);

            // Method + thời gian
            payload.put("method", payment.getPaymentMethod().name());
            payload.put("generatedAt", LocalDateTime.now().toString());

            // JSON -> QR
            String qrContent = objectMapper.writeValueAsString(payload);
            byte[] png = QRCodeGenerator.generateQRCodeImage(qrContent, 300, 300);
            String base64 = Base64.getEncoder().encodeToString(png);

            Map<String, Object> resp = new HashMap<>();
            resp.put("payment", payload);
            resp.put("qrBase64", base64);
            return resp;
        } catch (Exception e) {
            throw new RuntimeException("Generate QR failed", e);
        }
    }
}
