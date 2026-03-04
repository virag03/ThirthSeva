package com.tirthseva.api.dto.booking;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingListDTO {
    private Integer id;
    private String templeName;
    private String bhaktnivasName;
    private LocalDate darshanDate;
    private String darshanTime;
    private LocalDateTime bookingDate;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String bookingStatus;
    private Integer numberOfPersons;
}
