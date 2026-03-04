package com.tirthseva.api.dto.auth;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private Integer userId;
    private String name;
    private String email;
    private String role;
    private Boolean isEmailVerified;
}
