package com.example.autostore.service.admin;

import com.example.autostore.dto.admin.AdminFaceDTO;
import com.example.autostore.repository.UserFaceTemplateRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminFaceService {

    private final UserFaceTemplateRepository faceRepo;

    public AdminFaceService(UserFaceTemplateRepository faceRepo) {
        this.faceRepo = faceRepo;
    }

    public AdminFaceDTO getFaceByUserId(Long userId) {
        return faceRepo.findByUserId(userId)
                .map(f -> new AdminFaceDTO(
                        f.getUserId(),
                        true,
                        f.getModel(),
                        f.getDim(),
                        f.getVersion(),
                        f.getQualityScore(),
                        f.getCreatedAt()
                ))
                .orElse(new AdminFaceDTO(
                        userId,
                        false,
                        null,
                        null,
                        null,
                        null,
                        null
                ));
    }

    public void resetFace(Long userId) {
        faceRepo.findByUserId(userId)
                .ifPresent(faceRepo::delete);
    }
}
