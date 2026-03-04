package com.tirthseva.api.dto.bhaktnivas;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BhaktnivasListDTO {
    private Integer id;
    private Integer templeId;
    private String templeName;
    private String name;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private Boolean isAvailable;
    private String distanceFromTemple;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private String serviceProviderName;
}
