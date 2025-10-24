package com.example.autostore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private String userName;
    private String userEmail;
    private String avatarUrl;
    private Set<String> roles;
    private String userFullName;
    private String userPhone;
}
