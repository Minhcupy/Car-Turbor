package com.example.autostore.dto;

import lombok.*;

@Data
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class SignUpRequest {
    private String userName;
    private String email;
    private String password;
    private String userFullName;
    private String userPhone;


}
