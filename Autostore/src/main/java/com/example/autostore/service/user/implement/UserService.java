package com.example.autostore.service.user.implement;

import com.example.autostore.dto.UserResponseDTO;
import com.example.autostore.dto.user.UpdateUserDTO;
import com.example.autostore.dto.user.UserProfileDTO;
import com.example.autostore.model.AppUser;
import com.example.autostore.repository.UserRepository;
import com.example.autostore.service.user.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;

    public boolean checkEmailExists(String email) {
        return userRepository.existsByuserEmail(email);
    }

    public boolean checkUserNameExists(String userName) {
        return userRepository.existsByUserName(userName);
    }

    @Override
    public UserResponseDTO getUserInfo(String userName) {
        return userRepository.findByUserName(userName)
                .map(this::mapToDTO)
                .orElse(null);
    }

    @Override
    public UserResponseDTO updateUser(String userName, UpdateUserDTO dto) {
        return userRepository.findByUserName(userName)
                .map(user -> {
                    if (dto.getUserFullName() != null) user.setUserFullName(dto.getUserFullName());
                    if (dto.getUserPhone() != null) user.setUserPhone(dto.getUserPhone());
                    if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());

                    AppUser saved = userRepository.save(user);
                    return mapToDTO(saved);
                })
                .orElse(null);
    }

    public UserResponseDTO updateUserWithFile(String userName, String fullName, String phone, MultipartFile avatarFile) {
        return userRepository.findByUserName(userName)
                .map(user -> {
                    if (fullName != null) user.setUserFullName(fullName);
                    if (phone != null) user.setUserPhone(phone);

                    // Nếu có upload file ảnh
                    if (avatarFile != null && !avatarFile.isEmpty()) {
                        try {
                            // Tạo thư mục uploads nếu chưa có
                            String uploadDir = "uploads/";
                            File dir = new File(uploadDir);
                            if (!dir.exists()) {
                                dir.mkdirs();
                            }

                            // Tạo tên file random để tránh trùng
                            String fileName = UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();
                            File dest = new File(uploadDir + fileName);

                            // Lưu file vào thư mục uploads
                            avatarFile.transferTo(dest);

                            // Lưu đường dẫn URL để FE load (Spring phải config static resource cho /uploads/**)
                            user.setAvatarUrl("/uploads/" + fileName);

                        } catch (IOException e) {
                            throw new RuntimeException("Lỗi khi lưu avatar: " + e.getMessage());
                        }
                    }

                    AppUser saved = userRepository.save(user);
                    return mapToDTO(saved);
                })
                .orElse(null);
    }


    @Override
    public boolean deleteUser(String userName) {
        return userRepository.findByUserName(userName)
                .map(user -> {
                    user.setUserIsActive(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public UserProfileDTO getUserProfile(String userName) {
        return userRepository.findByUserName(userName)
                .map(this::mapToProfileDTO)
                .orElse(null);
    }

    private UserProfileDTO mapToProfileDTO(AppUser user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return new UserProfileDTO(
                user.getUserName(),
                user.getUserEmail(),
                user.getAvatarUrl(),
                roleNames,
                user.getUserFullName(),
                user.getUserPhone()
        );
    }

    private UserResponseDTO mapToDTO(AppUser user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return new UserResponseDTO(
                user.getUserName(),
                user.getUserEmail(),
                user.getAvatarUrl(),
                roleNames
        );
    }
}
