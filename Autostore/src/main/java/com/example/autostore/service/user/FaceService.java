package com.example.autostore.service.user;

import com.example.autostore.model.UserFaceTemplate;
import com.example.autostore.provider.FaceProvider;
import com.example.autostore.repository.UserFaceTemplateRepository;
import com.example.autostore.util.FaceEmbeddingCodec;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FaceService {

    private final FaceProvider faceProvider;
    private final UserFaceTemplateRepository repo;

    public boolean isEnrolled(long userId) {
        return repo.existsByUserId(userId);
    }

    public void enroll(long userId, MultipartFile image) {
        float[] emb = faceProvider.extractEmbedding(image);

        UserFaceTemplate t = repo.findByUserId(userId).orElseGet(UserFaceTemplate::new);
        t.setUserId(userId);
        t.setEmbedding(FaceEmbeddingCodec.toBytes(emb));
        t.setDim(emb.length);
        t.setModel("arcface_onnx");
        t.setVersion("v1");

        repo.save(t);
    }

    public boolean verify(long userId, MultipartFile image) {
        UserFaceTemplate t = repo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("FACE_NOT_ENROLLED"));
        return faceProvider.verify(image, t);
    }
}
