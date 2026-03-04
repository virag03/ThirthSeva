package com.tirthseva.api.dto.user;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Integer id;
    private String name;
    private String email;
    private String role;
    private Boolean isEmailVerified;
    private LocalDateTime createdAt;
}
