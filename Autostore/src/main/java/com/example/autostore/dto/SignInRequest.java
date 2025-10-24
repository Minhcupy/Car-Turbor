package com.example.autostore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
public class SignInRequest {
    private String userName;
    private String password;

    public SignInRequest(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }
}
