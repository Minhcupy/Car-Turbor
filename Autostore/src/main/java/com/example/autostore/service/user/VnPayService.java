package com.example.autostore.service.user;

import com.example.autostore.util.VnPayUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnPayService {

    @Value("${vnpay.tmnCode}") private String tmnCode;
    @Value("${vnpay.hashSecret}") private String hashSecret;
    @Value("${vnpay.payUrl}") private String payUrl;
    @Value("${vnpay.returnUrl}") private String returnUrl;
    @Value("${vnpay.ipnUrl}") private String ipnUrl;

    public String createPaymentUrl(String orderId, long amountVnd, String clientIp) {
        // amount: VNPay dùng đơn vị "xu" => nhân 100
        long amount = amountVnd * 100;

        String vnp_TxnRef = orderId; // nhưng orderId phải là "12"
        String vnp_OrderInfo = "Thanh toan don hang " + orderId;

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", vnp_TxnRef);
        params.put("vnp_OrderInfo", vnp_OrderInfo);
        params.put("vnp_OrderType", "other"); // hoặc theo ngành hàng
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", clientIp);

        // thời gian tạo
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        params.put("vnp_CreateDate", sdf.format(new Date()));

        // (khuyến nghị) expire 15 phút
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        cal.add(Calendar.MINUTE, 15);
        params.put("vnp_ExpireDate", sdf.format(cal.getTime()));

        // IPN (tuỳ hệ thống VNPay, có nơi cấu hình trên portal; nếu spec cho phép truyền)
//         params.put("vnp_IpnUrl", ipnUrl);

        var built = VnPayUtils.buildQuery(params);
        String secureHash = VnPayUtils.hmacSHA512(hashSecret, built.hashData());

        return payUrl + "?" + built.queryString() + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verify(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) return false;

        Map<String, String> filtered = new HashMap<>(params);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");

        var built = VnPayUtils.buildQuery(filtered);
        String calculated = VnPayUtils.hmacSHA512(hashSecret, built.hashData());

        return calculated.equalsIgnoreCase(receivedHash);
    }
}