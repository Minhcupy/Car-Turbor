package com.example.autostore.service.user;

import com.example.autostore.model.LoginOtp;
import com.example.autostore.repository.LoginOtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class LoginOtpService {

    private final LoginOtpRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    private static final int OTP_TTL_SECONDS = 300;
    private static final int MAX_ATTEMPTS = 5;

    public record IssueResult(Long otpId, int expiresInSeconds) {}

    public IssueResult issue(Integer userId, String email) {
        // (optional) cooldown resend 60s
        repo.findTopByUserIdOrderByCreatedAtDesc(userId).ifPresent(last -> {
            boolean recentlySent = last.getCreatedAt().isAfter(OffsetDateTime.now().minusSeconds(60));
            boolean stillValid = last.getExpiresAt().isAfter(OffsetDateTime.now());
            boolean notUsed = last.getUsedAt() == null;

            if (recentlySent && stillValid && notUsed) {
                throw new RuntimeException("OTP recently sent, please wait");
            }
        });

        String otp = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));

        LoginOtp entity = new LoginOtp();
        entity.setUserId(userId);
        entity.setOtpHash(passwordEncoder.encode(otp));
        entity.setExpiresAt(OffsetDateTime.now().plusSeconds(OTP_TTL_SECONDS));
        entity.setAttempts(0);

        entity = repo.save(entity);
        mailService.sendLoginOtp(email, otp, OTP_TTL_SECONDS);

        return new IssueResult(entity.getId(), OTP_TTL_SECONDS);
    }

    @Transactional
    public void verify(Integer userId, Long otpId, String otp) {
        LoginOtp entity = repo.findById(otpId)
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("OTP invalid"));

        if (entity.getUsedAt() != null) throw new RuntimeException("OTP used");
        if (entity.getExpiresAt().isBefore(OffsetDateTime.now())) throw new RuntimeException("OTP expired");
        if (entity.getAttempts() >= MAX_ATTEMPTS) throw new RuntimeException("OTP locked");

        if (!passwordEncoder.matches(otp, entity.getOtpHash())) {
            entity.setAttempts(entity.getAttempts() + 1);
            repo.save(entity);
            throw new RuntimeException("OTP invalid");
        }

        entity.setUsedAt(OffsetDateTime.now());
        repo.save(entity);
    }
}
