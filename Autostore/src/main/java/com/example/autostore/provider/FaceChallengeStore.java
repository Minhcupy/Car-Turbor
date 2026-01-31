package com.example.autostore.provider;

import com.example.autostore.dto.user.FaceChallenge;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FaceChallengeStore {

    private final Map<String, FaceChallenge> map = new ConcurrentHashMap<>();
    private final Duration ttl = Duration.ofMinutes(3);

    public FaceChallenge create(long userId, String action) {
        cleanup();
        String id = UUID.randomUUID().toString();
        FaceChallenge c = new FaceChallenge(id, userId, action, Instant.now().plus(ttl));
        map.put(id, c);
        return c;
    }

    public FaceChallenge getValid(String challengeId, long userId) {
        cleanup();
        FaceChallenge c = map.get(challengeId);
        if (c == null) throw new RuntimeException("CHALLENGE_NOT_FOUND");
        if (c.getUserId() != userId) throw new RuntimeException("CHALLENGE_NOT_OWNER");
        if (Instant.now().isAfter(c.getExpiresAt())) {
            map.remove(challengeId);
            throw new RuntimeException("CHALLENGE_EXPIRED");
        }
        return c;
    }

    public void consume(String challengeId) {
        map.remove(challengeId);
    }

    private void cleanup() {
        Instant now = Instant.now();
        map.entrySet().removeIf(e -> now.isAfter(e.getValue().getExpiresAt()));
    }
}