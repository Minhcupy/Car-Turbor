package com.example.autostore.util;

import java.nio.charset.StandardCharsets;

import java.security.MessageDigest;
import java.util.Base64;

public class ContractUtil {

    public static byte[] decodeDataUrl(String dataUrl) {
        String base64 = dataUrl.contains(",") ? dataUrl.substring(dataUrl.indexOf(",") + 1) : dataUrl;
        return Base64.getDecoder().decode(base64);
    }

    public static String sha256Hex(String s) {
        try {
            var md = MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : dig) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
