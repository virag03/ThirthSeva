package com.tirthseva.api.dto.bhaktnivas;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReleaseBhaktnivasSlotsRequest {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    @Min(1)
    @Max(1000)
    private Integer capacity;
}
