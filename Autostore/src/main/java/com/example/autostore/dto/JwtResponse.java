package com.example.autostore.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String accessToken;
    private String refreshToken;
    private Integer id;
    private String userName;
    private List<String> roles;


    public JwtResponse(String accessToken, String refreshToken, Integer id, String userName, List<String> roles) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.userName = userName;
        this.roles = roles;
    }
}
