package com.example.autostore.service.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

@Service
public class FaceVerifiedTokenService {

    private final byte[] secret;
    private final long ttlSeconds;

    public FaceVerifiedTokenService(
            @Value("${jwt.signerkey}") String signerKey,
            @Value("${face.token.ttlSeconds:180}") long ttlSeconds
    ) {
        this.secret = signerKey.getBytes(StandardCharsets.UTF_8);
        this.ttlSeconds = ttlSeconds;
    }

    public String issue(String username, String action) {
        long exp = Instant.now().getEpochSecond() + ttlSeconds;
        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = "{\"sub\":\"" + username + "\",\"act\":\"" + action + "\",\"exp\":" + exp + "}";

        String header = b64Url(headerJson.getBytes(StandardCharsets.UTF_8));
        String payload = b64Url(payloadJson.getBytes(StandardCharsets.UTF_8));
        String signingInput = header + "." + payload;

        String sig = hmacSha256(signingInput);
        return signingInput + "." + sig;
    }

    public void verifyOrThrow(String token, String username, String action) {
        if (token == null || token.isBlank()) throw new RuntimeException("FACE_TOKEN_REQUIRED");
        String[] parts = token.split("\\.");
        if (parts.length != 3) throw new RuntimeException("FACE_TOKEN_INVALID");

        String signingInput = parts[0] + "." + parts[1];
        String expected = hmacSha256(signingInput);
        if (!constantTimeEquals(expected, parts[2])) throw new RuntimeException("FACE_TOKEN_BAD_SIGNATURE");

        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);

        String sub = extractJsonString(payloadJson, "sub");
        String act = extractJsonString(payloadJson, "act");
        long exp = extractJsonLong(payloadJson, "exp");

        if (sub == null || act == null) throw new RuntimeException("FACE_TOKEN_INVALID_PAYLOAD");
        if (!sub.equals(username)) throw new RuntimeException("FACE_TOKEN_WRONG_USER");
        if (!act.equals(action)) throw new RuntimeException("FACE_TOKEN_WRONG_ACTION");
        if (Instant.now().getEpochSecond() > exp) throw new RuntimeException("FACE_TOKEN_EXPIRED");
    }

    private String hmacSha256(String input) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            byte[] sig = mac.doFinal(input.getBytes(StandardCharsets.UTF_8));
            return b64Url(sig);
        } catch (Exception e) {
            throw new RuntimeException("FACE_TOKEN_SIGN_FAILED", e);
        }
    }

    private static String b64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) return false;
        int r = 0;
        for (int i = 0; i < a.length(); i++) r |= a.charAt(i) ^ b.charAt(i);
        return r == 0;
    }

    private static String extractJsonString(String json, String key) {
        String k = "\"" + key + "\":";
        int i = json.indexOf(k);
        if (i < 0) return null;
        int start = json.indexOf('"', i + k.length());
        if (start < 0) return null;
        int end = json.indexOf('"', start + 1);
        if (end < 0) return null;
        return json.substring(start + 1, end);
    }

    private static long extractJsonLong(String json, String key) {
        String k = "\"" + key + "\":";
        int i = json.indexOf(k);
        if (i < 0) throw new RuntimeException("FACE_TOKEN_NO_EXP");
        int start = i + k.length();
        int end = start;
        while (end < json.length() && Character.isDigit(json.charAt(end))) end++;
        return Long.parseLong(json.substring(start, end));
    }
}