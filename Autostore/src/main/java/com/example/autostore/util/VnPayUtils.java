package com.example.autostore.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VnPayUtils {

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC SHA512", e);
        }
    }

    public static String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    /** Build hashData và queryString theo thứ tự key tăng dần */
    public static BuiltQuery buildQuery(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        boolean first = true;

        for (String key : fieldNames) {
            String value = params.get(key);
            if (value == null || value.isBlank()) continue;

            if (!first) {
                hashData.append("&");
                query.append("&");
            }
            first = false;

            hashData.append(key).append("=").append(urlEncode(value));
            query.append(urlEncode(key)).append("=").append(urlEncode(value));
        }

        return new BuiltQuery(hashData.toString(), query.toString());
    }

    public record BuiltQuery(String hashData, String queryString) {}
}