package com.tirthseva.api.dto.bhaktnivas;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BhaktnivasSlotDTO {
    private Integer id;
    private Integer bhaktnivasId;
    private LocalDate date;
    private Integer totalCapacity;
    private Integer availableCapacity;
}
