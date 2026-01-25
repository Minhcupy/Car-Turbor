package com.example.autostore.provider;

import com.example.autostore.model.UserFaceTemplate;
import org.springframework.web.multipart.MultipartFile;

public interface FaceProvider {

    /**
     * Trích xuất embedding từ ảnh (float32[]).
     * - Nếu không detect được mặt => throw FACE_NOT_DETECTED
     * - Nếu chất lượng kém => throw FACE_LOW_QUALITY
     */
    float[] extractEmbedding(MultipartFile image);

    /**
     * So sánh 2 embedding bằng cosine similarity.
     * Trả về true nếu >= threshold.
     */
    default boolean match(float[] emb1, float[] emb2, float threshold) {
        return cosine(emb1, emb2) >= threshold;
    }

    default float cosine(float[] a, float[] b) {
        if (a == null || b == null || a.length != b.length) {
            throw new IllegalArgumentException("Invalid embeddings");
        }
        double dot = 0, na = 0, nb = 0;
        for (int i = 0; i < a.length; i++) {
            dot += (double) a[i] * b[i];
            na += (double) a[i] * a[i];
            nb += (double) b[i] * b[i];
        }
        double denom = Math.sqrt(na) * Math.sqrt(nb);
        if (denom == 0) return 0f;
        return (float) (dot / denom);
    }
}
