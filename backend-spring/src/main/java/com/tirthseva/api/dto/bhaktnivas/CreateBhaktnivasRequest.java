package com.tirthseva.api.dto.bhaktnivas;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBhaktnivasRequest {

    @NotNull
    private Integer templeId;

    @NotBlank
    @Size(max = 200)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull
    @DecimalMin("10")
    @DecimalMax("200")
    private BigDecimal pricePerNight;

    @NotNull
    @Min(1)
    @Max(100)
    private Integer capacity;

    @Size(max = 50)
    private String distanceFromTemple;

    private String imageUrl;

    private Double latitude;

    private Double longitude;

    private String amenities;

    private String contactPhone;
}
