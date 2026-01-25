//package com.example.autostore.service.user;
//
//import com.example.autostore.provider.FaceProvider;
//import org.springframework.context.annotation.Primary;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.security.MessageDigest;
//
//@Service
//@Primary // ✅ để Spring ưu tiên bean này nếu có nhiều FaceProvider
//public class MockFaceProvider implements FaceProvider {
//
//    @Override
//    public float[] extractEmbedding(MultipartFile image) {
//        if (image == null || image.isEmpty()) throw new RuntimeException("IMAGE_REQUIRED");
//
//        try {
//            // DEV: tạo embedding 512d từ hash của bytes (ổn định theo ảnh)
//            byte[] bytes = image.getBytes();
//            byte[] hash = MessageDigest.getInstance("SHA-256").digest(bytes);
//
//            int dim = 512;
//            float[] emb = new float[dim];
//            for (int i = 0; i < dim; i++) {
//                int b = hash[i % hash.length] & 0xFF;
//                emb[i] = (b - 128) / 128f; // [-1..1]
//            }
//
//            // normalize
//            double sum = 0;
//            for (float v : emb) sum += (double) v * v;
//            double norm = Math.sqrt(sum);
//            if (norm > 1e-12) {
//                float inv = (float) (1.0 / norm);
//                for (int i = 0; i < emb.length; i++) emb[i] *= inv;
//            }
//
//            return emb;
//        } catch (Exception e) {
//            throw new RuntimeException("MOCK_EMBEDDING_FAILED", e);
//        }
//    }
//}
