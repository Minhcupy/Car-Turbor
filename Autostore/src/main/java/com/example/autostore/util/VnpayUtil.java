package com.example.autostore.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VnpayUtil {
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey =
                    new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);

            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) hash.append(String.format("%02x", b));
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // hashData: encode VALUE (US_ASCII) giống demo
    public static String buildHashData(Map<String, String> params) {
        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);

        StringBuilder sb = new StringBuilder();
        for (String k : keys) {
            String v = params.get(k);
            if (v == null || v.isBlank()) continue;

            if (sb.length() > 0) sb.append("&");
            sb.append(k).append("=")
                    .append(URLEncoder.encode(v, StandardCharsets.US_ASCII));
        }
        return sb.toString();
    }

    // query: encode KEY + VALUE (US_ASCII) giống demo
    public static String buildQueryString(Map<String, String> params) {
        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);

        StringBuilder sb = new StringBuilder();
        for (String k : keys) {
            String v = params.get(k);
            if (v == null || v.isBlank()) continue;

            if (sb.length() > 0) sb.append("&");
            sb.append(URLEncoder.encode(k, StandardCharsets.US_ASCII))
                    .append("=")
                    .append(URLEncoder.encode(v, StandardCharsets.US_ASCII));
        }
        return sb.toString();
    }
}
