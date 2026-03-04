package com.tirthseva.api.dto.bhaktnivas;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BhaktnivasDetailDTO {
    private Integer id;
    private Integer templeId;
    private String templeName;
    private String name;
    private String description;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private Boolean isAvailable;
    private String distanceFromTemple;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Integer serviceProviderId;
    private String serviceProviderName;
    private LocalDateTime createdAt;
}
