package com.example.autostore.service.user;

import com.example.autostore.dto.user.FaceChallengeCache;
import com.example.autostore.dto.user.FaceVerifiedCache;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class FaceRedisStore {
    private final StringRedisTemplate redis;
    private final ObjectMapper om;

    public FaceRedisStore(StringRedisTemplate redis, ObjectMapper om) {
        this.redis = redis;
        this.om = om;
    }

    private String chKey(String challengeId) { return "face:challenge:" + challengeId; }
    private String fvKey(String token) { return "face:verified:" + token; }

    public void saveChallenge(String challengeId, FaceChallengeCache value, Duration ttl) {
        try {
            redis.opsForValue().set(chKey(challengeId), om.writeValueAsString(value), ttl);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<FaceChallengeCache> getChallenge(String challengeId) {
        String raw = redis.opsForValue().get(chKey(challengeId));
        if (raw == null) return Optional.empty();
        try {
            return Optional.of(om.readValue(raw, FaceChallengeCache.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteChallenge(String challengeId) {
        redis.delete(chKey(challengeId));
    }

    public void saveVerifiedToken(String token, FaceVerifiedCache value, Duration ttl) {
        try {
            redis.opsForValue().set(fvKey(token), om.writeValueAsString(value), ttl);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public Optional<FaceVerifiedCache> getVerifiedToken(String token) {
        String raw = redis.opsForValue().get(fvKey(token));
        if (raw == null) return Optional.empty();
        try {
            return Optional.of(om.readValue(raw, FaceVerifiedCache.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /** one-time token: consume */
    public boolean consume(String token) {
        return Boolean.TRUE.equals(redis.delete(fvKey(token)));
    }
}
