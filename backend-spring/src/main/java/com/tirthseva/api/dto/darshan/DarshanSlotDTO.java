package com.tirthseva.api.dto.darshan;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DarshanSlotDTO {
    private Integer id;
    private Integer templeId;
    private LocalDate date;
    private String startTime;
    private String endTime;
    private Integer capacity;
    private Integer availableSlots;
    private BigDecimal price;
}
