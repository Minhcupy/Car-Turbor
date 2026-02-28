package com.example.autostore.controller.users;

import com.example.autostore.service.VnPayPaymentHandler;
import com.example.autostore.service.user.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/vnpay")
public class VnPayController {

    private final VnPayService vnPayService;
    private final VnPayPaymentHandler handler;

    public VnPayController(VnPayService vnPayService, VnPayPaymentHandler handler) {
        this.vnPayService = vnPayService;
        this.handler = handler;
    }

    // 1) FE gọi để lấy link thanh toán
    @PostMapping("/create-payment")
    public Map<String, Object> createPayment(@RequestBody CreatePaymentReq req, HttpServletRequest request) {
        String ip = getClientIp(request);
        String url = vnPayService.createPaymentUrl(req.orderId(), req.amountVnd(), ip);
        return Map.of("paymentUrl", url);
    }

    // 2) ReturnUrl: user browser redirect về (chỉ để hiển thị)
    @GetMapping("/return")
    public void handleReturn(@RequestParam Map<String, String> params, HttpServletResponse resp) throws IOException {
        boolean ok = vnPayService.verify(params);
        String code = params.get("vnp_ResponseCode");
        String bookingId = params.get("vnp_TxnRef");
        String txnNo = params.get("vnp_TransactionNo");

        // FE url bạn muốn hiển thị kết quả
        String fe = "http://localhost:3000/user/payment"
                + "?bookingId=" + URLEncoder.encode(bookingId, StandardCharsets.UTF_8)
                + "&code=" + URLEncoder.encode(code == null ? "" : code, StandardCharsets.UTF_8)
                + "&ok=" + ok
                + "&txnNo=" + URLEncoder.encode(txnNo == null ? "" : txnNo, StandardCharsets.UTF_8);

        resp.sendRedirect(fe);
    }

    // 3) IPN: VNPay gọi server-to-server (quan trọng)
    @GetMapping("/ipn")
    public Map<String, String> handleIpn(@RequestParam Map<String, String> params) {
        System.out.println("=== VNPay IPN HIT === " + params);

        boolean verifyOk = vnPayService.verify(params);
        System.out.println("=== VNPay IPN verifyOk = " + verifyOk
                + " | vnp_TmnCode=" + params.get("vnp_TmnCode"));

        if (!verifyOk) {
            return Map.of("RspCode", "97", "Message", "Invalid signature");
        }

        try {
            handler.handleVnpayIpn(params);
            System.out.println("=== VNPay IPN handled OK ===");
            return Map.of("RspCode", "00", "Message", "Confirm Success");
        } catch (Exception e) {
            e.printStackTrace(); // để thấy lỗi thật
            return Map.of("RspCode", "99", "Message", "Unknown error");
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) return xf.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    public record CreatePaymentReq(String orderId, long amountVnd) {}
}
