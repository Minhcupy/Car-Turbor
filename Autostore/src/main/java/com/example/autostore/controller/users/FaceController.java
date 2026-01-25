package com.example.autostore.controller.users;

import com.example.autostore.dto.user.FaceChallengeRequest;
import com.example.autostore.dto.user.FaceChallengeResponse;
import com.example.autostore.dto.user.FaceVerifyResponse;
import com.example.autostore.provider.CustomUserPrincipal;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.user.FaceService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/face")
public class FaceController {
    private final FaceService faceService;
    private final UserRepository userRepository;

    public FaceController(FaceService faceService, UserRepository userRepository) {
        this.faceService = faceService;
        this.userRepository = userRepository;
    }

    @PostMapping("/challenge")
    public ResponseEntity<FaceChallengeResponse> challenge(
            @RequestBody FaceChallengeRequest req,
            Authentication authentication) {

        String username = authentication.getName(); // lấy sub từ JWT

        Long userId = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"))
                .getUserId()
                .longValue();

        return ResponseEntity.ok(
                faceService.createChallenge(userId, req.action(), req.resourceId())
        );
    }



    @PostMapping(value = "/verify", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FaceVerifyResponse> verify(
            @RequestParam("challengeId") String challengeId,
            @RequestPart("image") MultipartFile image,
            Authentication authentication
    ) {
        String username = authentication.getName();

        Long userId = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"))
                .getUserId()
                .longValue(); // vì userId của bạn là Integer

        return ResponseEntity.ok(faceService.verify(userId, challengeId, image));
    }

    @PostMapping(value = "/enroll", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> enroll(
            @RequestPart("image") MultipartFile image,
            Authentication authentication
    ) {
        String username = authentication.getName();
        Integer userId = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"))
                .getUserId();

        faceService.enroll(Long.valueOf(userId), image); // tạo template và lưu vào user_face_templates
        return ResponseEntity.ok().build();
    }
    @GetMapping("/enrolled")
    public ResponseEntity<?> enrolled(Authentication authentication) {
        String username = authentication.getName();

        Long userId = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"))
                .getUserId()
                .longValue();

        boolean registered = faceService.hasEnrolledFace(userId);

        return ResponseEntity.ok(java.util.Map.of(
                "registered", registered,
                "userId", userId
        ));
    }

}

