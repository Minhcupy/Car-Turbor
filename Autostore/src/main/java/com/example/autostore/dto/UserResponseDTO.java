package com.example.autostore.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private String userName;
    private String userEmail;
    private String avatarUrl;
    private Set<String> roles; // vì AppUser có thể có nhiều role


}