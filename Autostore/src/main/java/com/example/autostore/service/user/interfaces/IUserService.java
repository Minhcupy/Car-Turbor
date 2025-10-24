package com.example.autostore.service.user.interfaces;

import com.example.autostore.dto.UserResponseDTO;
import com.example.autostore.dto.user.UpdateUserDTO;
import com.example.autostore.dto.user.UserProfileDTO;

public interface IUserService {
    boolean checkEmailExists(String email);
    boolean checkUserNameExists(String userName);
    UserResponseDTO getUserInfo(String userName);
    UserResponseDTO updateUser(String userName, UpdateUserDTO dto);
    boolean deleteUser(String userName);
    UserProfileDTO getUserProfile(String userName);
}
