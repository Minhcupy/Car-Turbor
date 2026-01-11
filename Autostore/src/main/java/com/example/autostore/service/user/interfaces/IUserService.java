package com.example.autostore.service.user.interfaces;

import com.example.autostore.dto.UserResponseDTO;
import com.example.autostore.dto.user.UpdateUserDTO;
import com.example.autostore.dto.user.UserBriefDTO;
import com.example.autostore.dto.user.UserProfileDTO;
import org.springframework.web.multipart.MultipartFile;

public interface IUserService {
    boolean checkEmailExists(String email);
    boolean checkUserNameExists(String userName);
    UserResponseDTO getUserInfo(String userName);
    UserResponseDTO updateUser(String userName, UpdateUserDTO dto);

    UserResponseDTO updateUserWithFile(String userName, String fullName, String phone, MultipartFile avatarFile);

    boolean deleteUser(String userName);
    UserProfileDTO getUserProfile(String userName);
    UserBriefDTO getUserBriefById(Integer id);

}
