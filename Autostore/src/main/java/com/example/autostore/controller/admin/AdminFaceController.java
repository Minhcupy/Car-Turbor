package com.example.autostore.controller.admin;

import com.example.autostore.dto.admin.AdminFaceDTO;
import com.example.autostore.model.UserFaceTemplate;
import com.example.autostore.repository.UserFaceTemplateRepository;
import com.example.autostore.service.admin.AdminFaceService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/faces")
public class AdminFaceController {

    private final AdminFaceService service;

    public AdminFaceController(AdminFaceService service) {
        this.service = service;
    }

    // Xem thông tin face của user
    @GetMapping("/{userId}")
    public ResponseEntity<AdminFaceDTO> getFace(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getFaceByUserId(userId));
    }

    // Reset khuôn mặt
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> reset(@PathVariable Long userId) {
        service.resetFace(userId);
        return ResponseEntity.noContent().build();
    }
}

