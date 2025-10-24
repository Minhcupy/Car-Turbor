package com.example.autostore.controller.users;

import com.example.autostore.dto.UserResponseDTO;
import com.example.autostore.dto.user.UpdateUserDTO;
import com.example.autostore.dto.user.UserProfileDTO;
import com.example.autostore.service.user.interfaces.IUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        String userName = authentication.getName(); // lấy từ JWT
        return ResponseEntity.ok(userService.getUserInfo(userName));
    }
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String userName = authentication.getName();
        UserProfileDTO user = userService.getUserProfile(userName);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(user);
    }
    // Cập nhật thông tin tài khoản
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(Authentication authentication, @RequestBody UpdateUserDTO dto) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String userName = authentication.getName();
        UserResponseDTO updated = userService.updateUser(userName, dto);

        if (updated == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(updated);
    }

    // Xoá tài khoản (soft delete)
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String userName = authentication.getName();
        boolean deleted = userService.deleteUser(userName);

        if (!deleted) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok("Account deleted successfully");
    }
}
