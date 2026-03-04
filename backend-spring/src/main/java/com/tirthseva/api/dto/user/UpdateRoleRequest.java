package com.tirthseva.api.dto.user;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRoleRequest {
    private String role;
}
