package com.example.autostore.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserBriefDTO {
    private Integer id;
    private String userName;
    private String avatarUrl;
}
