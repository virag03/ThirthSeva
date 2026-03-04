package com.tirthseva.api.dto.booking;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    @NotNull
    private Integer templeId;

    private Integer bhaktnivasId;

    private Integer darshanSlotId;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("100000")
    private BigDecimal totalAmount;

    private String specialRequests;

    @Min(1)
    @Max(1000)
    @Builder.Default
    private Integer numberOfPersons = 1;
}
