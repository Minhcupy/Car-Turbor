package com.example.autostore.controller.users;

import com.example.autostore.model.AppUser;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.user.FaceService;
import com.example.autostore.service.user.FaceVerifiedTokenService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/face")
@RequiredArgsConstructor
public class FaceController {

    private final FaceService faceService;
    private final FaceVerifiedTokenService tokenService;
    private final UserRepository userRepository;

    // DEV: in-memory challenge store (prod nên dùng Redis)
    private final Map<String, Challenge> challenges = new ConcurrentHashMap<>();

    @GetMapping("/enrolled")
    public Map<String, Object> enrolled(Authentication authentication) {
        String username = authentication.getName();
        long userId = resolveUserId(username);
        return Map.of(
                "registered", faceService.isEnrolled(userId),
                "userId", userId
        );
    }

    @PostMapping(value = "/enroll", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void enroll(@RequestParam("image") MultipartFile image, Authentication authentication) {
        String username = authentication.getName();
        long userId = resolveUserId(username);
        faceService.enroll(userId, image);
    }

    @PostMapping("/challenge")
    public Map<String, Object> challenge(@RequestBody ChallengeReq req, Authentication authentication) {
        String username = authentication.getName();
        String action = (req.action == null || req.action.isBlank()) ? "UNKNOWN" : req.action;

        String id = UUID.randomUUID().toString();
        Instant exp = Instant.now().plusSeconds(180);

        challenges.put(id, new Challenge(username, action, exp));

        return Map.of(
                "challengeId", id,
                "expiresAt", exp.toString(),
                "steps", new String[]{"Nhìn thẳng", "Không che mặt", "Đủ sáng"}
        );
    }

    @PostMapping(value = "/verify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> verify(@RequestParam("challengeId") String challengeId,
                                      @RequestParam("image") MultipartFile image,
                                      Authentication authentication) {
        String username = authentication.getName();

        Challenge c = challenges.get(challengeId);
        if (c == null) throw new RuntimeException("CHALLENGE_NOT_FOUND");
        if (!c.username.equals(username)) throw new RuntimeException("CHALLENGE_NOT_OWNER");
        if (Instant.now().isAfter(c.expiresAt)) {
            challenges.remove(challengeId);
            throw new RuntimeException("CHALLENGE_EXPIRED");
        }

        long userId = resolveUserId(username);
        boolean ok = faceService.verify(userId, image);

        // one-time use
        challenges.remove(challengeId);

        if (!ok) return Map.of("verified", false, "faceVerifiedToken", null);

        String token = tokenService.issue(username, c.action);
        return Map.of("verified", true, "faceVerifiedToken", token);
    }

    private long resolveUserId(String username) {
        AppUser u = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));
        // AppUser.userId là Integer -> convert sang long
        return u.getUserId().longValue();
    }

    @Data
    private static class ChallengeReq {
        private String action;
        private String resourceId;
    }

    private record Challenge(String username, String action, Instant expiresAt) {}
}
