package com.example.autostore.service;

import com.example.autostore.Enum.BookingStatus;
import com.example.autostore.Enum.PaymentMethod;
import com.example.autostore.Enum.PaymentStatus;
import com.example.autostore.model.AppUser;
import com.example.autostore.model.Booking;
import com.example.autostore.model.Payment;
import com.example.autostore.repository.IBookingRepository;
import com.example.autostore.repository.IPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class VnPayPaymentHandler {

    private final IBookingRepository bookingRepo;
    private final IPaymentRepository paymentRepo;

    @Transactional
    public void handleVnpayIpn(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");          // orderId
        String responseCode = params.get("vnp_ResponseCode");
        String txnNo = params.get("vnp_TransactionNo");    // mã GD VNPay
        String amountStr = params.getOrDefault("vnp_Amount", "0"); // *100
        double amountVnd = Long.parseLong(amountStr) / 100.0;

        // 1) Parse bookingId từ txnRef
        Integer bookingId = parseBookingId(txnRef);

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // 2) Idempotent: nếu txnNo đã xử lý thì bỏ qua
        if (txnNo != null && paymentRepo.existsByProviderTxnNo(txnNo)) {
            return;
        }

        // 3) Check amount hợp lệ (tùy business)
        // Ví dụ: chỉ cho thanh toán deposit
        double expected = booking.getDepositAmount() != null ? booking.getDepositAmount() : 0.0;

        // nếu bạn cho phép trả nhiều đợt thì check theo quy tắc khác
        if (Math.abs(amountVnd - expected) > 0.0001) {
            // amount không khớp => ghi FAILED để audit cũng được
            savePayment(booking, amountVnd, txnNo, PaymentStatus.FAILED, params);
            return;
        }

        if ("00".equals(responseCode)) {
            // SUCCESS
            savePayment(booking, amountVnd, txnNo, PaymentStatus.SUCCESS, params);

            double newPaid = (booking.getPaidAmount() == null ? 0.0 : booking.getPaidAmount()) + amountVnd;
            booking.setPaidAmount(newPaid);

            // cập nhật status booking tùy quy ước của bạn:
            // - Nếu deposit paid => CONFIRMED
            booking.setStatus(BookingStatus.CONFIRMED);

            bookingRepo.save(booking);

        } else {
            // FAILED/CANCELED
            savePayment(booking, amountVnd, txnNo, PaymentStatus.FAILED, params);
        }
    }

    private void savePayment(Booking booking, double amountVnd, String txnNo,
                             PaymentStatus status, Map<String, String> params) {

        // ✅ lấy người thanh toán từ booking/customer
        String payerName  = booking.getCustomer() != null ? booking.getCustomer().getCustomerName() : null;
        String payerEmail = booking.getCustomer() != null ? booking.getCustomer().getCustomerEmail() : null;
        String payerPhone = booking.getCustomer() != null ? booking.getCustomer().getCustomerPhone() : null;

        // ✅ lấy user nếu có
        AppUser user = null;
        if (booking.getCustomer() != null) {
            user = booking.getCustomer().getAppUser(); // đúng theo model bạn gửi trước đó
        }

        Payment p = Payment.builder()
                .booking(booking)
                .amount(amountVnd)
                .paymentMethod(PaymentMethod.VNPAY)
                .status(status)
                .providerTxnNo(txnNo)
                .payerName(payerName)
                .payerEmail(payerEmail)
                .payerPhone(payerPhone)
                .appUser(user)
                .build();

        paymentRepo.save(p);
    }

    private Integer parseBookingId(String txnRef) {
        // Nếu bạn set vnp_TxnRef = bookingId thuần số (vd "123") thì:
        try {
            return Integer.parseInt(txnRef);
        } catch (NumberFormatException e) {
            // Nếu bạn dùng format BOOKING_123
            if (txnRef != null && txnRef.contains("_")) {
                return Integer.parseInt(txnRef.substring(txnRef.lastIndexOf('_') + 1));
            }
            throw new RuntimeException("Invalid txnRef/bookingId: " + txnRef);
        }
    }
}