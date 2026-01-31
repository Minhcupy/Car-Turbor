package com.example.autostore.provider;

import com.example.autostore.model.UserFaceTemplate;
import org.springframework.web.multipart.MultipartFile;

public interface FaceProvider {
    float[] extractEmbedding(MultipartFile image);
    boolean verify(MultipartFile image, UserFaceTemplate template);
}
