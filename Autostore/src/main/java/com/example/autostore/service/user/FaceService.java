package com.example.autostore.service.user;

import com.example.autostore.dto.user.FaceChallengeCache;
import com.example.autostore.dto.user.FaceChallengeResponse;
import com.example.autostore.dto.user.FaceVerifiedCache;
import com.example.autostore.dto.user.FaceVerifyResponse;
import com.example.autostore.model.UserFaceTemplate;
import com.example.autostore.provider.EmbeddingCodec;
import com.example.autostore.provider.FaceProvider;
import com.example.autostore.repository.UserFaceTemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class FaceService {
    private final FaceRedisStore store;
    private final FaceProvider faceProvider;
    private final UserFaceTemplateRepository templateRepo;

    public FaceService(FaceRedisStore store, FaceProvider faceProvider, UserFaceTemplateRepository templateRepo) {
        this.store = store;
        this.faceProvider = faceProvider;
        this.templateRepo = templateRepo;
    }

    public FaceChallengeResponse createChallenge(Long userId, String action, String resourceId) {
        String challengeId = "c_" + UUID.randomUUID();
        List<String> steps = List.of("TURN_LEFT", "TURN_RIGHT"); // liveness đơn giản bên FE

        store.saveChallenge(
                challengeId,
                new FaceChallengeCache(userId, action, resourceId),
                Duration.ofMinutes(2)
        );

        return new FaceChallengeResponse(
                challengeId,
                OffsetDateTime.now().plusMinutes(2).toString(),
                steps
        );
    }

    public FaceVerifyResponse verify(Long userId, String challengeId, MultipartFile image) {
        FaceChallengeCache ch = store.getChallenge(challengeId)
                .orElseThrow(() -> new RuntimeException("CHALLENGE_EXPIRED"));

        if (!Objects.equals(ch.userId(), userId)) throw new RuntimeException("CHALLENGE_NOT_OWNER");

        UserFaceTemplate tpl = templateRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("FACE_NOT_ENROLLED"));

        float[] stored = EmbeddingCodec.fromBytes(tpl.getEmbedding(), tpl.getDim());

        // TODO: float[] current = faceProvider.extractEmbedding(image)
        float[] current = faceProvider.extractEmbedding(image);

        boolean matched = faceProvider.match(stored, current, 0.35f);
        if (!matched) return new FaceVerifyResponse(false, null);

        String token = "fv_" + UUID.randomUUID();
        store.saveVerifiedToken(token, new FaceVerifiedCache(userId, ch.action(), ch.resourceId()), Duration.ofMinutes(3));
        store.deleteChallenge(challengeId);

        return new FaceVerifyResponse(true, token);
    }

    public void enroll(Long userId, MultipartFile image) {
        if (image == null || image.isEmpty()) throw new RuntimeException("IMAGE_REQUIRED");

        float[] embedding = faceProvider.extractEmbedding(image);

        // ✅ tính qualityScore tại đây
        double quality = FaceQualityScorer.score(image);

        UserFaceTemplate tpl = templateRepo.findByUserId(userId)
                .orElseGet(() -> {
                    UserFaceTemplate t = new UserFaceTemplate();
                    t.setUserId(userId);
                    return t;
                });

        tpl.setEmbedding(EmbeddingCodec.toBytes(embedding));
        tpl.setDim(embedding.length);
        tpl.setModel("arcface_r100");
        tpl.setVersion("v1");

        // ✅ lưu điểm
        tpl.setQualityScore((float)quality);

        tpl.setUpdatedAt(OffsetDateTime.now());
        if (tpl.getCreatedAt() == null) tpl.setCreatedAt(OffsetDateTime.now());

        templateRepo.save(tpl);
    }

    public boolean hasEnrolledFace(Long userId) {
        return templateRepo.existsByUserId(userId);
    }
}
