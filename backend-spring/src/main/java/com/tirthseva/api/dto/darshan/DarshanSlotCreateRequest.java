package com.tirthseva.api.dto.darshan;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DarshanSlotCreateRequest {

    @NotNull
    private Integer templeId;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String startTime;

    @NotBlank
    private String endTime;

    @NotNull
    @Min(1)
    @Max(1000)
    private Integer capacity;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("10000")
    private BigDecimal price;
}
