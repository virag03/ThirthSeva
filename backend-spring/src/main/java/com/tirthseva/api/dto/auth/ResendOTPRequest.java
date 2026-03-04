package com.tirthseva.api.dto.auth;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResendOTPRequest {

    @NotBlank
    @Email
    private String email;
}
